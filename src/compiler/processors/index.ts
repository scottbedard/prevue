import { elementProcessor } from './elements';
import { FragmentProcessor } from 'src/types';

/**
 * All processors that will be run in order.
 */
export const processors: Array<FragmentProcessor> = [
    elementProcessor,
];