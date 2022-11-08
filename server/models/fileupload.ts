import {
  Sequelize,
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

const sequelize = new Sequelize();

// We recommend you declare an interface for the attributes, for stricter typechecking

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  filename: string;
  size: number;
  date: Date;
}

const Model = sequelize.define<UserModel>("FileUpload", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  filename: {
    type: DataTypes.STRING,
  },
  size: {
    type: DataTypes.NUMBER,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
});

export default Model;
