// import { BaseTool } from "./baseTool";

// export class DatabaseTool extends BaseTool {
//   /**
//    * Perform a database operation (e.g., query, insert).
//    *
//    * @param args - The arguments containing the database query and options.
//    * @returns The database operation result.
//    */
//   public async execute(args: { query: string; options: any }): Promise<any> {
//     try {
//       console.log(`Executing database query: ${args.query}`);
//       // Placeholder logic: Simulate database operation
//       return {
//         result: [{ id: 1, name: "Example Record" }], // Example query result
//         message: "Database operation completed successfully.",
//       };
//     } catch (error: any) {
//       throw new Error(`Failed to perform database operation: ${error.message}`);
//     }
//   }
// }
// src/tools/databaseTool.ts

import { BaseTool } from "./baseTool";
import mongoose from "mongoose";

export class DatabaseTool extends BaseTool {
  private connection: mongoose.Connection | null = null;

  /**
   * Connect to a MongoDB database.
   */
  public async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
      this.connection = mongoose.connection;
      console.log("Connected to MongoDB successfully.");
    } catch (error: any) {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
  }

  /**
   * Perform a database operation (e.g., query, insert).
   *
   * @param args - The arguments containing the database query and options.
   * @returns The database operation result.
   */
  public async execute(args: { query: string; options: any }): Promise<any> {
    try {
      if (!this.connection) {
        throw new Error("Not connected to a database.");
      }

      console.log(`Executing database query: ${args.query}`);
      // const result = await this.connection.db?.collection("your-collection").find(args.query).toArray();
      // Parse the query string into a filter object
      let filter: any;
      try {
        filter = JSON.parse(args.query); // Convert the query string to an object
      } catch (parseError: any) {
        throw new Error(`Invalid query format. Expected a JSON string: ${parseError.message}`);
      }

      // Perform the database query
      const result = await this.connection.db
        ?.collection("your-collection")
        .find(filter) // Use the parsed filter object
        .toArray();

      return {
        result: result,
        message: "Database operation completed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to perform database operation: ${error.message}`);
    }
  }
}

// const databaseTool = new DatabaseTool();
// await databaseTool.connect("mongodb://localhost:27017/mydatabase");

// const result = await databaseTool.execute({
//   query: '{"name": "John"}', // JSON string
//   options: {},
// });

// console.log(result);