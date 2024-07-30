


let file1="../plat/libs/java/sdk-fflags/testing-applications/openfeature-harness-json-yaml/Flags1.yaml"
let file2="../plat/libs/java/sdk-fflags/testing-applications/openfeature-harness-json-yaml/Flags2.yaml"

const yaml = require('yaml');
const fs   = require('fs');

// Get document, or throw exception on error
try {
  const doc1 = yaml.parse(fs.readFileSync(file1, 'utf8'));
  //console.log(doc1);
  const doc2 = yaml.parse(fs.readFileSync(file2, 'utf8'));
  //console.log(doc2.featureFlags.flags[0]);
 
  let featureFlagsInDoc1= doc1.featureFlags.flags;
  let featureFlagsInDoc2= doc2.featureFlags.flags;


let newAndCommonFlags=[];



for(let i=0;i<featureFlagsInDoc1.length;i++)
{


  let flag1= featureFlagsInDoc1[i]; 

//common flag found 

let commonFlagIndex= featureFlagsInDoc2.findIndex(feature=>flag1.flag.name==feature.flag.name);
//console.log(commonFlagIndex);
  if( commonFlagIndex!=-1)
    {
      newAndCommonFlags.push({flags:[flag1,featureFlagsInDoc2[commonFlagIndex]],common:true});
    }
    else //not found in flags2
    {

      newAndCommonFlags.push({flags:[flag1],common:false});
  
    }
 

 

}

console.log("for feature flag set2")

for(let j=0;j<featureFlagsInDoc2.length;j++)
  {
  
  
    let flag2= featureFlagsInDoc2[j]; 
    
    
  //common flag found 

  let commonFlagIndex= featureFlagsInDoc1.findIndex(feature=>flag2.flag.name==feature.flag.name);
 // console.log(commonFlagIndex);
  if( commonFlagIndex!=-1)
    {
   //   newAndCommonFlags.push({flags:[featureFlagsInDoc1[commonFlagIndex],flag2],common:true});
    }
    else //not found in flags2
      {
  
        newAndCommonFlags.push({flags:[flag2],common:false});
    
      }
   
  
   
  
  }


  console.log("starting foreach");


  let HARNESS_ACCOUNT_ID="TSJynUr6SmezTq0oNif7kg"
  let HARNESS_API_KEY="6fa26cd8-3cc0-422f-be20-1f4c264e6b38"
  let HARNESS_PIPELINE_ID="ui_styling_pipeline"
  let HARNESS_ORG_ID="TriNet"
  let HARNESS_PROJECT_ID="CloudApps"
  let HARNESS_TRIGGER_ID="ui_styling_trigger"

  /*
curl -X POST -H 'Content-Type: application/json' \
  --url "https://app.harness.io/gateway/pipeline/api/webhook/custom/v2?accountIdentifier=$HARNESS_ACCOUNT_ID&orgIdentifier=$HARNESS_ORG_ID&projectIdentifier=$HARNESS_PROJECT_ID&pipelineIdentifier=$HARNESS_PIPELINE_ID&triggerIdentifier=$HARNESS_TRIGGER_ID" \
  -d '{"flagSwitch": "ON"}'

  */
newAndCommonFlags.forEach(newAndCommonFlag=>{

if(newAndCommonFlag.common)
{
  //console.log("Common:",newAndCommonFlag.flags[0].flag.name,newAndCommonFlag.flags[1].flag.name);


  let flag1= newAndCommonFlag.flags[0].flag;
  let flag2= newAndCommonFlag.flags[1].flag;


  let  valueInDevelopForFlag1= flag1.environments.find(env=>env.identifier==='develop').state;
  let  valueInDevelopForFlag2= flag2.environments.find(env=>env.identifier==='develop').state;

  if(valueInDevelopForFlag1!=valueInDevelopForFlag2)
  {
  console.log('Flag '+flag1.name+' has changed to:   '+ valueInDevelopForFlag1);
  }



}
else
{
  let newFlag= newAndCommonFlag.flags[0].flag;
  let  valueInDevelopForNewFlag= newFlag.environments.find(env=>env.identifier==='develop').state;
 

  console.log("New:",newFlag.name," flag with value:",valueInDevelopForNewFlag);

}

});


console.log("done with foreach");

  
  
} catch (e) {
  console.log(e);
}
