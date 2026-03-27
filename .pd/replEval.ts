import { default as skipBlock, process as skipBlockProcess } from "skipBlock";
import { default as envTest, process as envTestProcess } from "envTest";
import { default as mockConditional, process as mockConditionalProcess } from "mockConditional";
import { default as exportIt, process as exportItProcess } from "exportIt";
import { default as UseCaps, process as UseCapsProcess } from "UseCaps";
import { default as testAll, process as testAllProcess } from "testAll";
import { default as mockBasic, process as mockBasicProcess } from "mockBasic";
import { default as edgeCases, process as edgeCasesProcess } from "edgeCases";
import { default as mockDirective, process as mockDirectiveProcess } from "mockDirective";
import { default as genCodeblock, process as genCodeblockProcess } from "genCodeblock";
import { default as dailyWallpaper, process as dailyWallpaperProcess } from "dailyWallpaper";
import { default as mockMixed, process as mockMixedProcess } from "mockMixed";
import { default as deeperConfig, process as deeperConfigProcess } from "deeperConfig";
import { default as shouldwork, process as shouldworkProcess } from "123shouldwork";
import { default as mockMultipleInputs, process as mockMultipleInputsProcess } from "mockMultipleInputs";
import { default as testTests, process as testTestsProcess } from "testTests";
import { default as multipleJsonConfigs, process as multipleJsonConfigsProcess } from "multipleJsonConfigs";
import { default as zodSchema, process as zodSchemaProcess } from "zodSchema";
import { default as shouldThrow, process as shouldThrowProcess } from "shouldThrow";
import $p from "jsr:@pd/pointers@0.1.1";

function test(pipe, { exclude = [], test = true } = {}) {
  pipe.json.config.inputs.forEach(i => {
    const match = exclude.map(path => $p.get(i, path)).some(Boolean)
    if(match) return;

    i.test = test;
    pipe.process(i).then(output => {
      console.log('Input:: '+JSON.stringify(i))
      output.errors && output.errors.map(e => console.error(e.message))
      output.data && console.info(output.data)
      console.log('')
    })
  })
}

async function step(pipe, { exclude = [], test = true } = {}) {
  const wTestMode = pipe.json.config.inputs.map(i => { i.test = test; return i })
  const inputIterable = wTestMode[Symbol.iterator]();
  let notDone = true;
  let continueLoop = true;
  while(notDone && continueLoop) {
    const { value, done } = inputIterable.next();
    if(done) notDone = false;
    if(notDone) {
      const match = exclude.map(path => $p.get(value, path)).some(Boolean)
      if(match) continue;
      const output = await pipe.process(value)
      console.log('Input:: ' + JSON.stringify(value))
      continueLoop = confirm('Press Enter to continue');
      output.errors && output.errors.map(e => console.error(e.message))
      console.info(output)
      console.log('')
    }
  }
}

const testSkipBlock = () => test(skipBlock);
const testEnvTest = () => test(envTest);
const testMockConditional = () => test(mockConditional);
const testExportIt = () => test(exportIt);
const testUseCaps = () => test(UseCaps);
const testTestAll = () => test(testAll);
const testMockBasic = () => test(mockBasic);
const testEdgeCases = () => test(edgeCases);
const testMockDirective = () => test(mockDirective);
const testGenCodeblock = () => test(genCodeblock);
const testDailyWallpaper = () => test(dailyWallpaper);
const testMockMixed = () => test(mockMixed);
const testDeeperConfig = () => test(deeperConfig);
const test123shouldwork = () => test(shouldwork);
const testMockMultipleInputs = () => test(mockMultipleInputs);
const testTestTests = () => test(testTests);
const testMultipleJsonConfigs = () => test(multipleJsonConfigs);
const testZodSchema = () => test(zodSchema);
const testShouldThrow = () => test(shouldThrow);
const stepSkipBlock = () => step(skipBlock);
const stepEnvTest = () => step(envTest);
const stepMockConditional = () => step(mockConditional);
const stepExportIt = () => step(exportIt);
const stepUseCaps = () => step(UseCaps);
const stepTestAll = () => step(testAll);
const stepMockBasic = () => step(mockBasic);
const stepEdgeCases = () => step(edgeCases);
const stepMockDirective = () => step(mockDirective);
const stepGenCodeblock = () => step(genCodeblock);
const stepDailyWallpaper = () => step(dailyWallpaper);
const stepMockMixed = () => step(mockMixed);
const stepDeeperConfig = () => step(deeperConfig);
const step123shouldwork = () => step(shouldwork);
const stepMockMultipleInputs = () => step(mockMultipleInputs);
const stepTestTests = () => step(testTests);
const stepMultipleJsonConfigs = () => step(multipleJsonConfigs);
const stepZodSchema = () => step(zodSchema);
const stepShouldThrow = () => step(shouldThrow);
