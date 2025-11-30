import createHttpError from 'http-errors';
import { InsertUser, UpdateUser, UserModel } from '../models/User.js';

export const getAllUsers = async () => {
  return UserModel.get();
};

export const getUser = async (id: number) => {
  return UserModel.first({ where: { id } });
};

export const createUser = async (data: Omit<InsertUser, 'id'>) => {
  const existing = await UserModel.first({ where: { email: data.email } });

  // TODO: Move validation to JsonTable
  if (existing) {
    throw createHttpError(409, 'Duplicate email');
  }

  const newRow = await UserModel.insert({
    id: Date.now(),
    ...data,
  });

  return newRow;
};

export const updateUser = async (
  id: number,
  updates: Omit<UpdateUser, 'id'>,
): Promise<InsertUser | undefined> => {
  if ('email' in updates) {
    const existing = await UserModel.first({
      where: { email: updates.email },
    });

    // don't throw on same user update but still the same email
    if (existing && existing.id !== id)
      throw createHttpError(409, 'Duplicate email');
  }

  const updatedRows = await UserModel.update({ set: updates, where: { id } });
  return updatedRows[0];
};

export const deleteUser = async (
  id: number,
): Promise<InsertUser | undefined> => {
  const rows = await UserModel.delete({ where: { id } });
  return rows[0];
};
