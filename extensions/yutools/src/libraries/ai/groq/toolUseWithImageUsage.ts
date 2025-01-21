import { GroqVisionClient } from "./GroqVisionClient";
import { toolDefinition } from "./toolDefinition";
import { toolUseWithImage } from "./toolUseWithImage";
import { ImageInput } from "./types";

const image: ImageInput = {
  type: "url",
  data: "https://example.com/dog.jpg",
};

const client = new GroqVisionClient();

toolUseWithImage(client, image, toolDefinition)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
