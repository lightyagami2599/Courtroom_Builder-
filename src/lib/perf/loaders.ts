import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

/**
 * Configures a GLTFLoader with Draco + KTX2 compression support.
 *
 * Usage:
 *   useLoader(GLTFLoader, url, configureGLTFLoader)
 *
 * Requires decoder binaries in /public/decoders/:
 *   - /public/decoders/draco/  (from node_modules/three/examples/jsm/libs/draco/)
 *   - /public/decoders/basis/  (from node_modules/three/examples/jsm/libs/basis/)
 */
export function configureGLTFLoader(loader: GLTFLoader, renderer?: any) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/decoders/draco/");
  loader.setDRACOLoader(dracoLoader);

  if (renderer) {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("/decoders/basis/");
    ktx2Loader.detectSupport(renderer);
    loader.setKTX2Loader(ktx2Loader);
  }
}
