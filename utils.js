//Debouncing an input => waiting for some time to pass 
//after trigger the event

const debounce = (func, delay = 1000) =>{
    let timeoutId;
    return (...args) => {
      
        //is timeId defined
        if(timeoutId){
            clearTimeout(timeoutId);
        }
       
            timeoutId = setTimeout(() =>{
                //apply all the args
                func.apply(null, args);
            }, delay);
    };
};
