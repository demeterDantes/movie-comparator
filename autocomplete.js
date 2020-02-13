//make the autocomplete resusable

const createAutoComplete = ({
    root,
    summary, 
    renderOption, 
    onOptionSelect, 
    inputValue,
    fetchData 
}) =>{

        root.innerHTML = `
            <label><b>Search For a Movie</b></label>
            <input class="input" />
            <div class="dropdown">
                <div class="dropdown-menu">
                <div class="dropdow-content results"></div>
                </div>
            </div>
        `;

        //access to change text and update value 
        //change document to root dont have to search all the document to find 
        //the properties
        const input = root.querySelector('input');
        const dropdown = root.querySelector('.dropdown');
        const resultsWrapper = root.querySelector('.results');

        input.addEventListener('input',()=>{
            if(!input.value){
                summary.innerHTML = '';
            }
        });

        //API on Input Change
        const onInput =  async e =>{

            //fetch the data -> movies
            const items = await fetchData(e.target.value); 
            
            //Handling Empty Responses
            if(!items.length){
                dropdown.classList.remove('is-active');
                //return for that function dont render anything
                return;
            };
            //clear for the next search
            resultsWrapper.innerHTML = '';
            //add styling css class to the dropdown menu 
            dropdown.classList.add('is-active');

            //search for movies 
            for(let item of items){
                const option = document.createElement('a');
                
                option.classList.add('dropdown-item');
                
                option.innerHTML = renderOption(item);

                //update the input value for any option we click and close the dropdow
                option.addEventListener('click', () =>{
                    dropdown.classList.remove('is-active');
                    input.value = inputValue(item);
                    onOptionSelect(item);
                })

                    //appent all the results to the resultsWrapper
                    resultsWrapper.appendChild(option);
            }
        };

        input.addEventListener('input', debounce(onInput, 500));

        //close dropdown menu
        //event listener to watch for any time that anyone clicks on any element
        document.addEventListener('click', e => {
            // if the route element for our little autocomplete doesn't contain the element that was
            //just clicked on then we need to close the dropdown
            if(!root.contains(e.target)){
                //remove the css class
                dropdown.classList.remove('is-active');
            }
        });
};