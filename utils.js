const debounce = (func,delay=1000) =>{
    let timeOutId;
    return(...args)=>{
        if (timeOutId){
            clearInterval(timeOutId);
        }
        timeOutId = setTimeout(()=>{
            func.apply(null,args)
        },delay)
    };
};
