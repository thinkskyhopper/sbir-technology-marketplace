
import { approvalOperations } from './approvalOperations';
import { moderationOperations } from './moderationOperations';
import { editOperations } from './editOperations';

export const adminOperations = {
  ...approvalOperations,
  ...moderationOperations,
  ...editOperations
};
