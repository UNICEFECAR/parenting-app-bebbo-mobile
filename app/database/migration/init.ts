import { ConfigSettingsEntity, ConfigSettingsSchema } from './../schema/ConfigSettingsSchema';

const getVariableEntity = (variable: ConfigSettingsEntity) => {
  return {
    key: variable.key,
    value: variable.value,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
} 
export const migrateuserRealm = async (oldRealm: any, newRealm: any) => {
  const oldObjects = oldRealm.objects('ChildEntity');
  // const newObjects = newRealm.objects('ChildEntity');
  const oldChildrenData = oldObjects;
  if (oldChildrenData?.length > 0) {
    oldChildrenData.map((item: any) => {
      console.log(item, "..item..");
    });

  }
}

export const migrateConfigSettings = async (oldRealm: any, newRealm: any) => {
  const oldObjects = oldRealm.objects('VariableEntity').filtered("key=='currentActiveChildId' OR key=='userParentalRole' OR key=='userName'  OR key=='userEnteredChildData'");
  // const newObjects = newRealm.objects(ConfigSettingsSchema.name);
  const oldChildrenData = oldObjects;
  if (oldChildrenData?.length > 0) {
    oldChildrenData.map((item: any) => {
      const createresult = newRealm.create(ConfigSettingsSchema.name, getVariableEntity(item));
      console.log("createresult-",createresult);
    });
  }

}
