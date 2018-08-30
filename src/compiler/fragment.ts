import Code from './code';

type LifecycleHook = 'create' | 'destroy' | 'mount' | 'update';

/**
 * Fragment
 */
export default class Fragment extends Code
{
    /**
     * @var {string} name
     */
    name: string;
    
    /**
     * Constructor.
     * 
     * @param  {string} name
     */
    constructor(name: string = 'unknownFragment') {
        super(`
            function ${name}() {
                :init

                return {
                    c: :create,
                    d: :destroy,
                    m: :mount,
                    p: :update,
                };
            }
        `);

        // set fragment name
        this.name = name;

        // register dynamic lifecycle hook partials
        ['create', 'destroy', 'mount', 'update'].forEach((hook) => {
            this.registerDynamicPartial(hook, () => this.getPartial(hook));
        });
    }

    /**
     * Returns a lifecycle partial, or noop if there is no content.
     * 
     * @param  {string} name
     * @return {string}
     */
    getPartial(name: string): string {
        if (this.partialIsEmpty(name)) {
            return this.registerHelper('noop');
        }

        return `
            function ${name}() {
                ${this.partials[name].join('\n\n')}
            }
        `;
    }
}