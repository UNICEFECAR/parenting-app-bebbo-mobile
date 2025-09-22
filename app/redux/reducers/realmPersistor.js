import { getRealmLib, safeOpenRealm } from './realmSafe';

const FRAGMENT_SIZE = 16000000; // Limit of 16 MB per string

const ITEM_SCHEMA = {
  name: "ReduxPersistItem",
  primaryKey: "name",
  properties: {
    name: "string",
    fragments: "string[]"
  }
};

let ItemSchemaClass = null;
async function getItemSchemaClass() {
  if (!ItemSchemaClass) {
    const Realm = await getRealmLib();
    class ItemSchema extends Realm.Object {
      static schema = ITEM_SCHEMA;

      get content() {
        return this.fragments.join("");
      }
    }
    ItemSchemaClass = ItemSchema;
  }
  return ItemSchemaClass;
}

function fragmentString(str) {
  const fragments = [];
  for (let i = 0; (i * FRAGMENT_SIZE) < str.length; i++) {
    fragments.push(str.substr(i * FRAGMENT_SIZE, FRAGMENT_SIZE));
  }
  return fragments;
}

// Wrap function to support both Promise and callback
// Copied from repo https://github.com/Nohac/redux-persist-expo-fs-storage/blob/master/index.js
async function withCallback(callback, func) {
  try {
    const result = await func();
    if (callback) {
      callback(null, result);
    }
    return result;
  } catch (err) {
    if (callback) {
      callback(err);
    } else {
      throw err;
    }
  }
}

function createRealmAccess(path) {
  let __realm = null;
  return async function accessRealm() {
    if (!__realm) {
      // const Realm = await getRealmLib();
      const ItemSchema = await getItemSchemaClass();
      try {
        __realm = await safeOpenRealm({
          schema: [ItemSchema],
          schemaVersion: 1,
          path,
          migration: (oldRealm, newRealm) => {
            console.log(newRealm)
            if (oldRealm.schemaVersion < 1) {
              const oldItems = oldRealm.objects(ITEM_SCHEMA.name);
              const newItems = oldRealm.objects(ITEM_SCHEMA.name);   
              for (let i = 0; i < oldItems.length; i++) {
                newItems[i].fragments = fragmentString(oldItems[i].content);
              }
            }
          },
        });
      } catch (error) {
        console.log("realmPersistor accessRealm error", error);
        throw error;
      }
    }
    return __realm;
  };
}

export function createRealmPersistStorage({ path } = {}) {
  const accessRealm = createRealmAccess(path);

  async function accessItemInstances() {
    const realm = await accessRealm();
    const ItemSchema = await getItemSchemaClass();
    return realm.objects(ItemSchema);
  }

  async function getItem(key, callback) {
    return withCallback(callback, async function() {
      const items = await accessItemInstances();
      const matches = items.filtered(`name = "${key}"`);
      if (matches.length > 0 && matches[0]) {
        return matches[0].content;
      } else {
        throw new Error(`Could not get item with key: '${key}'`);
      }
    });
  }

  async function setItem(key, value, callback) {
    return withCallback(callback, async function() {
      const Realm = await getRealmLib();
      const realm = await accessRealm();
      realm.write(() => {
        realm.create(
          ITEM_SCHEMA.name,
          {
            name: key,
            fragments: fragmentString(value),
          },
          Realm.UpdateMode.Modified
        );
      });
    });
  }

  async function removeItem(key, callback) {
    return withCallback(callback, async function() {
      const realm = await accessRealm();
      const items = await accessItemInstances();
      realm.write(() => {
        const item = items.filtered(`name = "${key}"`);
        realm.delete(item);
      });
    });
  }

  return {
    getItem,
    setItem,
    removeItem
  };
}