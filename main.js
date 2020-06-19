window.onload = function() {
    /**
     * number of the generated images in the album
     */
    const photosNumber = 70;

    /**
     * number of image samples in the images folder
     */
    const sampleNumbers = 50;

    /**
     * the album container,
     * a grid container
     */
    const photosContainer = document.querySelector(".photos-container");

    /**
     * the modal for fullscreen view;
     */
    const photosModal = document.querySelector(".photos-modal");

    /**
     * the fulscreen view close button
     */
    const modalCloseButton = document.querySelector(".photos-modal > .close-button");

    /**
     * the image-wrapper of that modal;
     */
    const imageWrapper = document.querySelector(".photos-modal > .photos-modal-image-wrapper");

    /**
     *  number of columns in the grid (the number specified in the stylesheet)
     */
    const gridColumns = 4;

    /**
     * 
     * number of rows in the grid (the number specified in the stylesheet)
     */
    const gridRows = 4;

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
        return dimensions;
    }
    
    /**
     * calculates the aspect ratio and sets the number of grid rows and columns  
     */
    const getAspectRatioEstimate = ([width, height]) => {
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

        /*in case the num. of rows/columns calculated by this func. exceeds the num. of grid rows/columns specified by CSS, might happen with ultra-narrow/wide images*/
        if (rows > gridRows || columns > gridColumns) {
            if (rows > columns) {
                rows = gridRows;
            } else {
                columns = gridColumns;
            }
        }

        /**
         * the calculated number of grid rows and columns as an array, first rows then columns
         */
        let gridLayout = [rows, columns];

        return gridLayout
    }

    /**
     * a function for opening the image in fullscreen
     * estimates the source of the high-res version, dynamically creates a new image and append it to the modal, then displays it 
     */
    const goToFullscreen = (target) => {
        /*add the loading*/
        imageWrapper.innerHTML = "<img src='images/media/loading.gif' class='loading-image'/>";

        /**store the predicted src of the high-res image from the src of the normal one*/
        let highResSubstitute = `images/high-res/${target.getAttribute("src").substring(7)}`;

        /**create the high-res image to display in fullscreen*/
        let highResImg = document.createElement("img");
        /*don't append it to the wrapper till it's loaded*/
        highResImg.addEventListener("load", function() {
            /*clear the imageWrapper (from previous images) and append the created high-res image to it*/
            imageWrapper.innerHTML = "";
            imageWrapper.appendChild(highResImg);
            highResImg.classList.add("ready");
        })
        highResImg.src=highResSubstitute;

        /*display the modal*/
        photosModal.style.display = "block";

        /*attach an event handler for the close button*/
        modalCloseButton.addEventListener("click", closeFullscreen)
    }


    /**
     * simply closes the fullscreen modal by adding display:none
     */
    const closeFullscreen = () => {
        photosModal.style.display = "none";
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
            /*an event on the image click, to open it in fullscreen.*/
            img.addEventListener("click", function() {goToFullscreen(this)});
            /**/
            img.src=`images/image${randomNum}.jpg`;
            imgWrapper.appendChild(img);
    
            /*Push the generated element to the container*/
            photosContainer.appendChild(imgWrapper);

            /*increment this variable to count the execution times */
            funcExecTimes++;
        }
    }

    /* run the function only if the container exists, to avoid errors and freezes on other pages, where it doesn't exist */
    if(photosContainer) {
        createGridElements();
    }
    
}