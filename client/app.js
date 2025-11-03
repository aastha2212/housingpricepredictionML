function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for(var i in uiBathrooms) {
      if(uiBathrooms[i].checked) {
          return parseInt(i)+1;
      }
    }
    return -1; // Invalid Value
  }

  function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for(var i in uiBHK) {
      if(uiBHK[i].checked) {
          return parseInt(i)+1;
      }
    }
    return -1; // Invalid Value
  }

  function validateForm() {
    var sqft = document.getElementById("uiSqft");
    var location = document.getElementById("uiLocations");
    var errorMessage = document.getElementById("errorMessage");

    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    if (!sqft.value || sqft.value <= 0) {
      errorMessage.textContent = "Please enter a valid area (greater than 0).";
      errorMessage.style.display = "block";
      return false;
    }

    if (!location.value.trim()) {
      errorMessage.textContent = "Please select a location.";
      errorMessage.style.display = "block";
      return false;
    }

    return true;
  }

  function onClickedEstimatePrice() {
    if (!validateForm()) return;

    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");
    var loading = document.getElementById("loading");
    var errorMessage = document.getElementById("errorMessage");
    var estimateBtn = document.getElementById("estimateBtn");

    // Show loading, hide result and error
    loading.style.display = "block";
    estPrice.style.display = "none";
    errorMessage.style.display = "none";
    estimateBtn.disabled = true;
    estimateBtn.textContent = "Estimating...";

    // var url = "http://127.0.0.1:5000/predict_home_price"; //Use this if you are NOT using nginx which is first 7 tutorials
    var url = "/predict_home_price"; // Use this if  you are using nginx. i.e tutorial 8 and onwards

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    },function(data, status) {
        console.log(data.estimated_price);
        var price = parseFloat(data.estimated_price);
        var minPrice = Math.max(0, price - 10);
        var maxPrice = price + 10;
        estPrice.innerHTML = "<h2>" + price.toFixed(2) + " Lakh</h2><p class=\"price-details\">Estimated range: " + minPrice.toFixed(2) + " - " + maxPrice.toFixed(2) + " Lakh</p>";
        estPrice.style.display = "block";
        loading.style.display = "none";
        estimateBtn.disabled = false;
        estimateBtn.textContent = "Estimate Price";
        console.log(status);
    }).fail(function(xhr, status, error) {
        console.error("Error:", error);
        errorMessage.textContent = "Failed to estimate price. Please try again.";
        errorMessage.style.display = "block";
        loading.style.display = "none";
        estimateBtn.disabled = false;
        estimateBtn.textContent = "Estimate Price";
    });
  }

  function resetForm() {
    document.getElementById("predictionForm").reset();
    document.getElementById("uiEstimatedPrice").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("estimateBtn").disabled = false;
    document.getElementById("estimateBtn").textContent = "Estimate Price";
  }

  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    var themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  }

  function onPageLoad() {
    console.log( "document loaded" );

    // Load theme preference
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      document.querySelector('.theme-toggle').textContent = '☀️';
    }

    // var url = "http://127.0.0.1:5000/get_location_names"; // Use this if you are NOT using nginx which is first 7 tutorials
    var url = "/get_location_names"; // Use this if  you are using nginx. i.e tutorial 8 and onwards
    $.get(url,function(data, status) {
        console.log("got response for get_location_names request");
        if(data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("locationsList");
            $('#locationsList').empty();
            for(var i in locations) {
                var opt = document.createElement("option");
                opt.value = locations[i];
                uiLocations.appendChild(opt);
            }
        }
    }).fail(function(xhr, status, error) {
        console.error("Failed to load locations from server:", error);
        // Fallback: load from local JSON if server fails
        $.getJSON('columns.json', function(data) {
            var locations = data.data_columns.slice(3); // Skip first 3 columns
            var uiLocations = document.getElementById("locationsList");
            $('#locationsList').empty();
            for(var i in locations) {
                var opt = document.createElement("option");
                opt.value = locations[i];
                uiLocations.appendChild(opt);
            }
        }).fail(function() {
            console.error("Failed to load locations from local JSON as well.");
            var errorMessage = document.getElementById("errorMessage");
            errorMessage.textContent = "Failed to load locations. Please refresh the page.";
            errorMessage.style.display = "block";
        });
    });
  }

  window.onload = onPageLoad;
