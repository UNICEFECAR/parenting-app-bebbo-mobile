import { ConfigSettingsEntity, ConfigSettingsSchema } from './../schema/ConfigSettingsSchema';

const getVariableEntity = (variable: ConfigSettingsEntity):any => {
  return {
    key: variable.key,
    value: variable.value,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
} 
export const migrateuserRealm = async (oldRealm: any, newRealm: any):Promise<any> => {
  const oldObjects = oldRealm.objects('ChildEntity');
  console.log(newRealm);
  const oldChildrenData = oldObjects;
  if (oldChildrenData?.length > 0) {
    oldChildrenData.map((item: any) => {
      console.log(item, "..item..");
    });

  }
}

export const migrateConfigSettings = async (oldRealm: any, newRealm: any):Promise<any> => {
  const oldObjects = oldRealm.objects('VariableEntity').filtered("key=='currentActiveChildId' OR key=='userParentalRole' OR key=='userName'  OR key=='userEnteredChildData'");
  const oldChildrenData = oldObjects;
  if (oldChildrenData?.length > 0) {
    oldChildrenData.map((item: any) => {
      const createresult = newRealm.create(ConfigSettingsSchema.name, getVariableEntity(item));
      console.log("createresult-",createresult);
    });
  }

}
