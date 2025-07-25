import { EntitySchema } from "typeorm";

export const VideoSchema = new EntitySchema({
  name: "Video",
  tableName: "video",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
      nullable: true,
    },
    publicId: {
      type: String,
    },
    originalSize: {
      type: String,
    },
    compressedSize: {
      type: String,
    },
    duration: {
      type: "float",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
