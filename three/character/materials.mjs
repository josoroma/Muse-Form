import * as THREE from 'three';

// These are authored material settings for the CC0 glTF assets. No generator or
// runtime code from CharacterCreator is used. Texture maps remain unmodified.
const SKIN = '#c99880';
const HAIR = '#91816b';
const IRIS = '#406d86';

function physicalFrom(source) {
  const material = new THREE.MeshPhysicalMaterial();
  THREE.MeshStandardMaterial.prototype.copy.call(material, source);
  material.userData = structuredClone(source.userData || {});
  return material;
}

function tint(material, color) {
  material.color.set(color);
  material.color.multiplyScalar(Number(material.userData.tint?.gain) || 1);
}

function skinMaterial(source) {
  const material = physicalFrom(source);
  tint(material, SKIN);
  material.roughness = .58;
  material.metalness = 0;
  material.normalScale.set(.15, .15);
  material.ior = 1.4;
  material.specularIntensity = .4;
  material.clearcoat = 0;
  material.side = THREE.FrontSide;
  material.userData.surfaceRole = 'skin';
  material.userData.shadingMethod = 'PBR with restrained diffuse wrap; not volumetric subsurface scattering';
  // A modest diffuse wrap softens the light terminator without making skin
  // emissive or adding a view-dependent color wash. Actual shadows still apply.
  material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vSkinRestPosition;');
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvSkinRestPosition = position;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vSkinRestPosition;');
    const chunk = THREE.ShaderChunk.lights_physical_pars_fragment.replace(
      'vec3 irradiance = dotNL * directLight.color;',
      `float skinWrapped = saturate( ( dot( geometryNormal, directLight.direction ) + 0.22 ) / 1.22 );
      vec3 irradiance = mix( dotNL, skinWrapped, 0.16 ) * directLight.color;`
    );
    shader.fragmentShader = shader.fragmentShader.replace('#include <lights_physical_pars_fragment>', chunk);
    const directLighting = THREE.ShaderChunk.lights_fragment_begin.replaceAll(
      'directionalLightShadow.shadowIntensity,', 'directionalLightShadow.shadowIntensity * 0.72,'
    );
    shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', directLighting);
    const skinMap = THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;', `
      float limbBalance = 1.0 - smoothstep( 1.15, 1.30, vSkinRestPosition.y );
      float skinLuminance = dot( sampledDiffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) );
      vec3 evenSkin = mix( vec3( skinLuminance ), sampledDiffuseColor.rgb, 0.40 );
      evenSkin = mix( evenSkin, vec3( 0.62 ), 0.30 );
      sampledDiffuseColor.rgb = mix( sampledDiffuseColor.rgb, evenSkin, limbBalance * 0.8 );
      diffuseColor *= sampledDiffuseColor;
    `);
    // The source skin atlas gives the inner mouth its own UV island in the lower
    // right. Gate by REST head height as finger islands share this UV neighborhood;
    // raising the posed hand must never make it acquire the mouth's shading.
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
      ${skinMap}
      #ifdef USE_MAP
        float oralIsland = smoothstep( 0.746, 0.756, vMapUv.x )
          * ( 1.0 - smoothstep( 0.937, 0.945, vMapUv.x ) )
          * smoothstep( 0.854, 0.866, vMapUv.y )
          * smoothstep( 1.38, 1.42, vSkinRestPosition.y );
        diffuseColor.rgb *= mix( vec3( 1.0 ), vec3( 0.19, 0.15, 0.16 ), oralIsland );
      #endif
    `);
  };
  material.customProgramCacheKey = () => 'muse-licensed-skin-wrap-v3';
  return material;
}

function hairMaterial(source) {
  const material = physicalFrom(source);
  tint(material, HAIR);
  material.metalness = 0;
  material.roughness = .57;
  material.specularIntensity = .32;
  material.ior = 1.46;
  material.anisotropy = .35;
  material.anisotropyRotation = Math.PI / 2;
  material.sheen = .16;
  material.sheenRoughness = .7;
  material.sheenColor.set('#c2ad88');
  material.alphaTest = .31;
  material.alphaToCoverage = true;
  material.transparent = false;
  material.depthWrite = true;
  material.side = THREE.DoubleSide;
  material.userData.surfaceRole = 'hair';
  material.onBeforeCompile = shader => {
    const map = THREE.ShaderChunk.map_fragment.replace(
      'diffuseColor *= sampledDiffuseColor;',
      // The source was prepared from a dark-hair photograph. Compress its baked
      // light/dark contrast for blonde fibers; alpha retains every fine strand.
      `sampledDiffuseColor.rgb = mix( vec3( 0.5 ), sampledDiffuseColor.rgb, 0.72 );
      // Restrained longitudinal fibre variation. Derivative fading suppresses
      // fine bands below pixel scale, so the distant hair does not shimmer.
      float fibreFrequency = 300.0;
      float fibrePhase = vMapUv.x * 6.2831853 * fibreFrequency
        + sin( vMapUv.y * 12.5663706 ) * 0.24;
      float fibreWidth = fwidth( vMapUv.x ) * fibreFrequency;
      float fibreVisibility = 1.0 - smoothstep( 0.12, 0.42, fibreWidth );
      float fineVisibility = 1.0 - smoothstep( 0.12, 0.42, fibreWidth * 2.17 );
      float fibre = ( sin( fibrePhase ) * fibreVisibility + 0.34 * sin( fibrePhase * 2.17 + 0.7 ) * fineVisibility ) / 1.34;
      sampledDiffuseColor.rgb *= 1.0 + 0.065 * fibre;
      diffuseColor *= sampledDiffuseColor;`
    );
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', map);
  };
  material.customProgramCacheKey = () => 'muse-licensed-blonde-fibres-v2';
  return material;
}

/** Tune an independently cloned character. The caller owns the returned scene.
 * Textures are shared immutable source data; material instances are never shared
 * with the source scene or another call. Morph/skin attributes are untouched.
 */
export function tuneCharacterMaterials(scene) {
  const replacements = new Map();
  const counts = {};
  function tune(source) {
    if (replacements.has(source)) return replacements.get(source);
    let material;
    const name = source.name;
    if (name === 'Skin') material = skinMaterial(source);
    else if (name.startsWith('Hair')) material = hairMaterial(source);
    else {
      material = physicalFrom(source);
      material.metalness = 0;
      if (name === 'Iris') {
        tint(material, IRIS);
        material.roughness = .32;
        material.specularIntensity = .3;
      } else if (name === 'Eye') {
        material.color.set('#f2eee6');
        material.roughness = .28;
        material.specularIntensity = .35;
      } else if (name === 'Cornea') {
        material.color.set('#ffffff');
        material.roughness = .025;
        material.specularIntensity = .65;
        material.opacity = .055;
        material.transparent = true;
        material.depthWrite = false;
      } else if (name === 'Eyebrow' || name === 'Eyelash') {
        tint(material, name === 'Eyebrow' ? '#66503b' : '#3a2e29');
        material.roughness = .84;
        material.specularIntensity = .08;
        material.alphaTest = .045;
        material.opacity = name === 'Eyebrow' ? .88 : .84;
        material.alphaToCoverage = false;
        material.transparent = true;
        material.depthWrite = false;
        material.side = THREE.DoubleSide;
      } else if (name === 'Teeth') {
        material.color.set('#eee5d4');
        material.roughness = .36;
        material.specularIntensity = .3;
        material.envMapIntensity = .5;
        // Teeth and gingiva share one source texture. Keep ivory enamel while
        // reducing the bright red gum texels inside the recessed oral cavity.
        material.onBeforeCompile = shader => {
          const dentalMap = THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;', `
            float gingiva = smoothstep( 0.025, 0.10, sampledDiffuseColor.r - max( sampledDiffuseColor.g, sampledDiffuseColor.b ) );
            // The source atlas includes strong painted gray patches on enamel.
            // Compress only the neutral enamel texels; retain recessed pink gums.
            vec3 enamel = mix( vec3( 0.76, 0.76, 0.74 ), sampledDiffuseColor.rgb, 0.18 );
            sampledDiffuseColor.rgb = mix( enamel, sampledDiffuseColor.rgb * vec3( 0.43, 0.37, 0.38 ), gingiva );
            diffuseColor *= sampledDiffuseColor;
          `);
          shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', dentalMap);
        };
        material.customProgramCacheKey = () => 'muse-licensed-dental-v2';
      } else if (name === 'Tongue') {
        material.color.set('#927575');
        material.roughness = .5;
        material.specularIntensity = .25;
        material.envMapIntensity = .5;
      }
      material.userData.surfaceRole = name.toLowerCase();
    }
    material.name = name;
    replacements.set(source, material);
    counts[name] = (counts[name] || 0) + 1;
    return material;
  }
  scene.traverse(object => {
    if (!object.isMesh) return;
    object.material = Array.isArray(object.material) ? object.material.map(tune) : tune(object.material);
    const name = Array.isArray(object.material) ? '' : object.material.name;
    // Small alpha cards should not stamp jagged black lash/brow shadows on skin.
    const fine = /^(Eyebrow|Eyelash|Cornea|Eye|Iris|Teeth|Tongue)$/.test(name);
    object.castShadow = !fine;
    object.receiveShadow = !fine;
    if (fine) object.userData.noShadow = true;
  });
  return { materialCount: replacements.size, roles: counts };
}

/** Three.js Material.clone does not preserve custom shader functions. Use this
 * for region/instance material copies after tuning the shared template. */
export function cloneCharacterMaterial(source) {
  const material = source.clone();
  material.onBeforeCompile = source.onBeforeCompile;
  material.customProgramCacheKey = source.customProgramCacheKey;
  return material;
}

/** A quiet gray anatomical bodysuit, with a grazing cloth sheen rather than
 * metallic highlights. The caller provides a fitted skinned garment surface.
 */
export function createBodysuitMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    name: 'Anatomical bodysuit', color: '#626c6e', metalness: 0,
    roughness: .84, ior: 1.46, specularIntensity: .22,
    sheen: .26, sheenColor: '#a0acad', sheenRoughness: .86,
    side: THREE.FrontSide,
  });
  material.userData.surfaceRole = 'bodysuit';
  return material;
}
