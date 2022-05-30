import { Options } from "@mikro-orm/core";

const options: Options = {
  seeder: {
    path: __dirname + "/seeder",
    defaultSeeder: "OrderSeeder",
    glob: "!(*.d).{js,ts}",
    emit: "ts",
    fileName: (className: string) => className,
  },
  entities: [__dirname + "/entities"],
  type: "mysql",
  dbName: "b1project",
  debug: true,
  port: 3306,
  user: "root",
  password: "Qazwer123.",
};

export default options;
