const fetchData = async (searchTerm) =>{
    const response = await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey:'45f0aa7f',
            s:searchTerm
        }
    });

    console.log(response.data);
}

const input = document.querySelector('input');
let timeOutId;
const onInput = event =>{
    if (timeOutId){
        clearTimeout(timeOutId)
    }
    timeOutId = setTimeout(()=>{
        fetchData(event.target.value)},
        1000)
}

input.addEventListener('input',onInput)
