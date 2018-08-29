import Code from './code';

type LifecycleHook = 'create' | 'destroy' | 'mount' | 'update';

/**
 * Fragment
 */
export default class Fragment extends Code
{
    /**
     * @var {Code} create
     */
    create: Code;

    /**
     * @var {Code} destroy
     */
    destroy: Code;

    /**
     * @var {Code} mount
     */
    mount: Code;

    /**
     * @var {Code} update
     */
    update: Code;
    
    /**
     * Constructor.
     */
    constructor() {
        super(`
            function createMainFragment() {
                return {
                    c: :create,
                    d: :destroy,
                    m: :mount,
                    p: :update,
                };
            }
        `);

        this.create = new Code;
        this.destroy = new Code;
        this.mount = new Code;
        this.update = new Code;

        this.registerDynamicPartial('create', () => this.getPartial('create'));
        this.registerDynamicPartial('destroy', () => this.getPartial('destroy'));
        this.registerDynamicPartial('mount', () => this.getPartial('mount'));
        this.registerDynamicPartial('update', () => this.getPartial('update'));
    }

    /**
     * Returns a lifecycle partial, or noop if there is no content.
     * 
     * @param  {string}     name
     */
    getPartial(name: LifecycleHook): string {
        if (this.partialIsEmpty(name)) {
            return this.registerHelper('noop');
        }

        return `
            function create() {
                // hmmm
            }
        `;
    }
}