var Module = function(){
    // dynamic lookup of .invoke
    var module = function(){
           return module.invoke.apply(module || this, arguments);
     };
    
    // double dynamic lookup
    module.invoke = function(){
        return module.defaultInvoke.apply(this, arguments);
     };
};
/*
What's the reason for this?
If we set .invoke = anonymous function with logic, if we switch .invoke to something else, we lose this anonymous function
If we set .invoke = .another, we are able to encapsulate and save this logic
If we simply set .invoke = .another, it will work, but it won't be dynamic.  Basically, if we change .another to a new function, .invoke will still call the old one.
If we want to be able to have an .invoke switcher (switch around between multiple .invoke methods) and be able to swap out those .subs by name, and have .invoke still access the new one, we need double dynamic lookup.
Certainly this is a little excessive for most cases, but I do think it could come in handy.*/