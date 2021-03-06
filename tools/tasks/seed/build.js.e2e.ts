import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';
import { makeTsProject, templateLocals } from '../../utils';

const plugins = <any>gulpLoadPlugins();
const jsonSystemConfig = JSON.stringify(Config.SYSTEM_CONFIG_DEV);

/**
 * Executes the build process, transpiling the TypeScript files (including the e2e-spec files, excluding the spec files)
 * for the e2e environment.
 */
export = () => {
  let tsProject = makeTsProject();
  let src = [
    'typings/index.d.ts',
    Config.TOOLS_DIR + '/manual_typings/**/*.d.ts',
    join(Config.APP_CLIENT_SRC, '**/*.ts'),
    '!' + join(Config.APP_CLIENT_SRC, '**/*.spec.ts'),
    '!' + join(Config.APP_CLIENT_SRC, `**/${Config.BOOTSTRAP_FACTORY_PROD_MODULE}.ts`)
  ];
  let result = gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.typescript(tsProject));

  return result.js
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.template(Object.assign(templateLocals(), {
      SYSTEM_CONFIG_DEV: jsonSystemConfig
    })))
    .pipe(gulp.dest(Config.APP_CLIENT_DEST));
};
