(function (cornerstoneWADOImageLoader) {

    "use strict";

    function getRescaleSlopeAndIntercept(dataSet)
    {
        // NOTE - we default these to an identity transform since modality LUT
        // module is not required for all SOP Classes
        var result = {
            intercept : 0.0,
            slope: 1.0
        };

        var rescaleIntercept = dataSet.floatString('x00281052');
        var rescaleSlope = dataSet.floatString('x00281053');

        if(rescaleIntercept && rescaleSlope) {
            result.intercept = rescaleIntercept;
            result.slope = rescaleSlope;
        }
        return result;
    }

    // module exports
    cornerstoneWADOImageLoader.getRescaleSlopeAndIntercept = getRescaleSlopeAndIntercept;
}(cornerstoneWADOImageLoader));