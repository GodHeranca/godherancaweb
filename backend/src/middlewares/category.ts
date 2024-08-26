import mongoose, { Types } from 'mongoose';
import { ICategory } from '../model/Category';

export const addSubcategoryMiddleware = (
  schema: mongoose.Schema<ICategory>,
) => {
  schema.pre<ICategory>(
    'save',
    async function (
      this: ICategory & { _previousParentCategory?: Types.ObjectId },
      next: Function,
    ) {
      try {
        if (this.isNew && this.parentCategory) {
          await mongoose
            .model<ICategory>('Category')
            .findByIdAndUpdate(
              this.parentCategory,
              { $addToSet: { subcategories: this._id } },
              { new: true },
            );
        } else if (this.isModified('parentCategory')) {
          if (this.parentCategory) {
            await mongoose
              .model<ICategory>('Category')
              .findByIdAndUpdate(
                this.parentCategory,
                { $addToSet: { subcategories: this._id } },
                { new: true },
              );
          }

          if (
            this._previousParentCategory &&
            this._previousParentCategory.toString() !==
              this.parentCategory?.toString()
          ) {
            await mongoose
              .model<ICategory>('Category')
              .findByIdAndUpdate(
                this._previousParentCategory,
                { $pull: { subcategories: this._id } },
                { new: true },
              );
          }
        }
        next();
      } catch (error) {
        next(error);
      }
    },
  );

  schema.pre<ICategory>(
    'save',
    function (
      this: ICategory & { _previousParentCategory?: Types.ObjectId },
      next: Function,
    ) {
      if (this.isModified('parentCategory')) {
        this._previousParentCategory = this.parentCategory;
      }
      next();
    },
  );
};

export const removeSubcategoryMiddleware = (
  schema: mongoose.Schema<ICategory>,
) => {
  schema.pre<ICategory>(
    'deleteOne',
    { document: true, query: true },
    async function (this: ICategory, next: Function) {
      try {
        if (this.parentCategory) {
          await mongoose
            .model<ICategory>('Category')
            .findByIdAndUpdate(
              this.parentCategory,
              { $pull: { subcategories: this._id } },
              { new: true },
            );
        }
        next();
      } catch (error) {
        next(error);
      }
    },
  );
};
