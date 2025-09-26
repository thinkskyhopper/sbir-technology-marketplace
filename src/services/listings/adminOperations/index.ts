
import { approvalOperations } from './approvalOperations';
import { moderationOperations } from './moderationOperations';
import { editOperations } from './editOperations';
import { statusOperations } from './statusOperations';

export const adminOperations = {
  ...approvalOperations,
  ...moderationOperations,
  ...editOperations,
  ...statusOperations
};
