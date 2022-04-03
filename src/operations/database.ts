import { DBTableNames } from "$constants";
import { fetchPrecipitation, fetchTemperature } from "$rests";
import { IChartItem } from "$models";

interface PromiseSaveResult {
  key: DBTableNames;
  result: IChartItem[];
}

const saveFetchToDB = (
  db: IDBDatabase,
  dbTableName: DBTableNames,
  rest: () => Promise<IChartItem[]>
): Promise<PromiseSaveResult> =>
  new Promise((resolve, reject) => {
    const fetchPromise = rest();

    fetchPromise.then((result) => {
      const addPromises: Promise<boolean>[] = [];

      result.forEach((item) => {
        const trnGet = db.transaction(dbTableName, "readonly");

        const trnRequest = trnGet.objectStore(dbTableName).get(item.t);

        addPromises.push(
          new Promise((resolve) => {
            trnGet.oncomplete = () => {
              if (!trnRequest.result) {
                const trnAdd = db.transaction(dbTableName, "readwrite");

                trnAdd.objectStore(dbTableName).add(item);

                trnAdd.oncomplete = () => {
                  resolve(true);
                };
              } else {
                resolve(true);
              }
            };
          })
        );
      });

      Promise.all(addPromises).then(() => {
        const trnGetAll = db.transaction(dbTableName, "readonly");

        const trnRequest = trnGetAll.objectStore(dbTableName).getAll();

        trnGetAll.oncomplete = () => {
          resolve({ key: dbTableName, result: trnRequest.result });
        };

        trnGetAll.onerror = (error) => {
          reject(error);
        };
      });
    });
  });

export const initDB = new Promise<PromiseSaveResult[]>((resolve, reject) => {
  let dbConnection = indexedDB.open("DB", 1);

  dbConnection.onerror = () => {
    reject(dbConnection.error);
  };

  dbConnection.onsuccess = () => {
    let db = dbConnection.result;

    const precipitationSave = saveFetchToDB(
      db,
      DBTableNames.precipitation,
      fetchPrecipitation
    );

    const temperatureSave = saveFetchToDB(
      db,
      DBTableNames.temperature,
      fetchTemperature
    );

    Promise.all([precipitationSave, temperatureSave]).then((result) => {
      resolve(result);
    });

    db.onversionchange = function () {
      db.close();

      reject("База данных устарела");
    };
  };

  dbConnection.onupgradeneeded = function () {
    let db = dbConnection.result;

    if (!db.objectStoreNames.contains(DBTableNames.precipitation)) {
      db.createObjectStore(DBTableNames.precipitation, {
        keyPath: "t",
      });
    }

    if (!db.objectStoreNames.contains(DBTableNames.temperature)) {
      db.createObjectStore(DBTableNames.temperature, {
        keyPath: "t",
      });
    }
  };
});
