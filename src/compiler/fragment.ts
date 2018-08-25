import Code from './code';

type LifecycleHook = {
    append: Function,
}

/**
 * Fragment
 */
export default class Fragment extends Code
{
    /**
     * @var {Helpers} helpers
     */
    create: LifecycleHook = {
        append() {

        },
    };
    
    /**
     * Constructor.
     */
    constructor() {
        super(`
            function createMainFragment() {
                return {
                    // c: :create,
                    // d: :destroy,
                    // m: :mount,
                    // p: :update,
                }
            }
        `);
    }
}