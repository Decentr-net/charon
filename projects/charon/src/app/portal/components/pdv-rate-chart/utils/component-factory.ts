import { Compiler, ComponentRef, Injector, Type } from '@angular/core';

export class ComponentFactoryClass<M, C> {
  constructor(private injector: Injector, private compiler: Compiler) {}

  createComponent = (module: Type<M>, component: Type<C>): ComponentRef<C> => {
    const compiledModule = this.compiler.compileModuleAndAllComponentsSync(module);
    const factory = compiledModule.ngModuleFactory
      .create(this.injector)
      .componentFactoryResolver.resolveComponentFactory(component);
    return factory.create(this.injector);
  };
}
