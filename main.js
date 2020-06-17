window.onload = function() {
    /**
     * number of the generated images in the album
     */
    const photosNumber = 50;

    /**
     * number of image samples in the images folder
     */
    const sampleNumbers = 30;
    /**
     * the album container,
     * a grid container
     */
    const photosContainer = document.querySelector(".photos-container");

    /**
     * returns the natural dimensions of the image, not working properly when the image isn't loaded  
     */
    const getNaturalDimensions = (img) => {
        let width;
        let height;

        width = img.width;
        height = img.height;

        /**
         * the dimensions of the image as an array, width first, then height
         */
        let dimensions = [width, height];
        // console.log(dimensions)
        return dimensions;
    }
    
    /**
     * calculates the aspect ratio and sets the number of grid rows and columns  
     */
    const getAspectRatioEstimate = ([width, height]) => {
        // console.log(width, height)
        let rows;
        let columns;
        let ratio = width / height;

        if (ratio > 1) {
            rows = 1;
            if(ratio < 0.5) {
                columns = 1;
            } else if (ratio > 0.5) {
                columns = Math.round(ratio);
            }
            
        } else if (ratio < 1) {
            columns = 1;
            if(ratio < 0.5) {

            }
            rows = Math.round(1 / ratio);
        }

        /**
         * the calculated number of grid rows and columns as an array, first rows then columns
         */
        let gridLayout = [rows, columns];

        // console.log(`width: ${width}, height: ${height}, ratio: ${ratio}`);
        // console.log(gridLayout);
        return gridLayout
    }










    /** *********************************************************************************************** */


    /**
     * A variable to limit the execution times of the "createGridElements" function
    */
    let funcExecTimes = 0;

    /**
     * A function for dynamically creating the grid items of the photos' container
     */
    function createGridElements() {
        if(funcExecTimes < photosNumber) {
            /**
             * A random number generated at the start of the function that creates the grid elements
             */
            let randomNum = Math.floor(Math.random() * (sampleNumbers-1) + 1);
    
            /*Create the image wrapper*/
            let imgWrapper = document.createElement("div");
            imgWrapper.classList.add("item", "invisible");
            /*Create the image itself*/
            let img = document.createElement("img");
            /*Add an event on the image load, has to be before specifying the src attr*/
            img.addEventListener("load", function(){
                /*the keyword this references to the image*/
                let imgDimensions = getNaturalDimensions(this);
                let rowsNcolumns = getAspectRatioEstimate(imgDimensions);
                this.parentElement.classList.add(`r${rowsNcolumns[0]}`, `c${rowsNcolumns[1]}`);
                this.parentElement.classList.remove("invisible");
                createGridElements();
            });
            img.src=`images/image${randomNum}.jpg`;
            imgWrapper.appendChild(img);
    
            /*Push the generated element to the container*/
            photosContainer.appendChild(imgWrapper);

            /*increment this variable to count the execution times */
            funcExecTimes++;
        }
    }
    
    createGridElements();

}