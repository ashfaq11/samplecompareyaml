let file1="../Flags1.yaml"
let file2="../Flags2.yaml"

const environment = "develop";

const yaml = require('yaml');
const axios = require('axios');
const fs = require('fs');

try {
  const doc1 = yaml.parse(fs.readFileSync(file1, 'utf8'));
  const doc2 = yaml.parse(fs.readFileSync(file2, 'utf8'));

  const featureFlagsInDoc1 = doc1.featureFlags.flags;
  const featureFlagsInDoc2 = doc2.featureFlags.flags;

  let newAndCommonFlags = [];

  console.log("For feature flag set 1");

  for (let i = 0; i < featureFlagsInDoc1.length; i++) {
    const flag1 = featureFlagsInDoc1[i];

    const commonFlagIndex = featureFlagsInDoc2.findIndex(feature => {
      return (
        flag1.flag.name === feature.flag.name
      );
    });

    if (commonFlagIndex !== -1) {
      newAndCommonFlags.push({ flags: [flag1, featureFlagsInDoc2[commonFlagIndex]], common: true });
    } else {
      newAndCommonFlags.push({ flags: [flag1], common: false });
    }
  }

  console.log("For feature flag set 2");

  for (let j = 0; j < featureFlagsInDoc2.length; j++) {
    const flag2 = featureFlagsInDoc2[j];

    const commonFlagIndex = featureFlagsInDoc1.findIndex(feature => {
      return flag2.flag.name === feature.flag.name;
    });

    if( commonFlagIndex!=-1){
     //   newAndCommonFlags.push({flags:[featureFlagsInDoc1[commonFlagIndex],flag2],common:true});
      }else /*not found in flags2*/{
          newAndCommonFlags.push({flags:[flag2],common:false});
      }
  }
 //console.log(JSON.stringify(newAndCommonFlags, null, 2));
  console.log("Starting foreach");

  const HARNESS_ACCOUNT_ID = "TSJynUr6SmezTq0oNif7kg";
  const HARNESS_API_KEY = "6fa26cd8-3cc0-422f-be20-1f4c264e6b38";
  const HARNESS_PIPELINE_ID = "CommitFlagPipeline";
  const HARNESS_ORG_ID = "TriNet";
  const HARNESS_PROJECT_ID = "CloudApps";
  const HARNESS_TRIGGER_ID = "CommitFlagPipeLineTrigger";

  newAndCommonFlags.forEach(newAndCommonFlag => {
    if (newAndCommonFlag.common) {
      const flag1 = newAndCommonFlag.flags[0].flag;
      const flag2 = newAndCommonFlag.flags[1].flag;

      const valueInDevelopForFlag1 = flag1.environments.find(env => env.identifier === environment).state;
      const valueInDevelopForFlag2 = flag2.environments.find(env => env.identifier === environment).state;

      if (valueInDevelopForFlag1 !== valueInDevelopForFlag2) {
        console.log(`Flag ${flag1.name} has changed to: ${valueInDevelopForFlag1}`);

        const flagPipelineUrl = `https://app.harness.io/gateway/pipeline/api/webhook/custom/v2?accountIdentifier=${HARNESS_ACCOUNT_ID}&orgIdentifier=${HARNESS_ORG_ID}&projectIdentifier=${HARNESS_PROJECT_ID}&pipelineIdentifier=${HARNESS_PIPELINE_ID}&triggerIdentifier=${HARNESS_TRIGGER_ID}`;

        const data = {
          flagName: flag1.name,
          flagSwitch: valueInDevelopForFlag1,
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        // Send feature flag pipeline request if value has changed
           axios.post(flagPipelineUrl, data, config)
           .then(response => {
             console.log(`Feature flag pipeline started for: ${flag1.name}`);
             console.log(response.data);
           })
           .catch(error => {
             console.error(error);
           }); 
      }
    } else {
      const newFlag = newAndCommonFlag.flags[0].flag;
      const valueInDevelopForNewFlag = newFlag.environments.find(env => env.identifier === environment).state;

      console.log(`New: ${newFlag.name} flag with value: ${valueInDevelopForNewFlag}`);
    }
  });

  console.log("Done with foreach");
} catch (e) {
  console.log(e);
}
