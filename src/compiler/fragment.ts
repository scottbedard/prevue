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
                    m: :mount,
                    p: :update,
                    d: :destroy,
                };
            }
        `);

        // set fragment name
        this.name = name;

        // register dynamic lifecycle hook partials
        ['create', 'destroy', 'update'].forEach((hook) => {
            this.registerDynamicPartial(hook, () => this.getPartial(hook));
        });
    }

    /**
     * Mount.
     * 
     * @return {string}
     */
    getMountPartial(): string {
        if (this.partialIsEmpty('mount')) {
            return this.registerHelper('noop');
        }

        return `
            function mount(target, anchor) {
                ${this.partials.mount.join('\n\n')}
            }
        `
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