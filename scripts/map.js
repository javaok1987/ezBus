/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function() {

  'use strict';

  var stopsAry = [];

  var busLayer = new google.maps.Data();
  var mrtLayer = new google.maps.Data();
  var traLayer = new google.maps.Data();
  var ubikeLayer = new google.maps.Data();

  var GMap = {
    map: {},
    centerMarker: {},
    centerCircle: {},
    infowindow: {},
    level: {
      B: true,
      Y: true,
      T: true,
      M: true
    }
  };

  GMap.initialize = function(callback) {
    var latlng = new google.maps.LatLng(25.046281027241395, 121.51760685634758);
    var mapOptions = {
      zoom: 13,
      disableDefaultUI: true,
      scrollwheel: false,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      // center: new google.maps.LatLng() //全台23.714059, 120.832002
      styles: [{'featureType':'administrative','elementType':'all','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'administrative','elementType':'labels','stylers':[{'saturation':'-100'}]},{'featureType':'administrative','elementType':'labels.text','stylers':[{'gamma':'0.75'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'lightness':'-37'}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#f9f9f9'}]},{'featureType':'landscape.man_made','elementType':'geometry','stylers':[{'saturation':'-100'},{'lightness':'40'},{'visibility':'off'}]},{'featureType':'landscape.natural','elementType':'labels.text.fill','stylers':[{'saturation':'-100'},{'lightness':'-37'}]},{'featureType':'landscape.natural','elementType':'labels.text.stroke','stylers':[{'saturation':'-100'},{'lightness':'100'},{'weight':'2'}]},{'featureType':'landscape.natural','elementType':'labels.icon','stylers':[{'saturation':'-100'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'saturation':'-100'},{'lightness':'80'}]},{'featureType':'poi','elementType':'labels','stylers':[{'saturation':'-100'},{'lightness':'0'}]},{'featureType':'poi.attraction','elementType':'geometry','stylers':[{'lightness':'-4'},{'saturation':'-100'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'},{'visibility':'on'},{'saturation':'-95'},{'lightness':'62'}]},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{'featureType':'road','elementType':'all','stylers':[{'lightness':20}]},{'featureType':'road','elementType':'labels','stylers':[{'saturation':'-100'},{'gamma':'1.00'}]},{'featureType':'road','elementType':'labels.text','stylers':[{'gamma':'0.50'}]},{'featureType':'road','elementType':'labels.icon','stylers':[{'saturation':'-100'},{'gamma':'0.50'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'},{'saturation':'-100'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'lightness':'-13'}]},{'featureType':'road.highway','elementType':'labels.icon','stylers':[{'lightness':'0'},{'gamma':'1.09'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'},{'saturation':'-100'},{'lightness':'47'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'lightness':'-12'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'saturation':'-100'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'},{'lightness':'77'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'lightness':'-5'},{'saturation':'-100'}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'saturation':'-100'},{'lightness':'-15'}]},{'featureType':'transit.station.airport','elementType':'geometry','stylers':[{'lightness':'47'},{'saturation':'-100'}]},{'featureType':'water','elementType':'all','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]},{'featureType':'water','elementType':'geometry','stylers':[{'saturation':'53'}]},{'featureType':'water','elementType':'labels.text.fill','stylers':[{'lightness':'-42'},{'saturation':'17'}]},{'featureType':'water','elementType':'labels.text.stroke','stylers':[{'lightness':'61'}]}]
    };
    // 台北車站:25.0459331,121.5191915
    // 101:25.0339186,121.5624493

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // getCurrentLocation(); //定位.

    this.centerMarker = new google.maps.Marker({
      draggable: true,
      position: latlng,
      map: this.map,
      icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNCIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEwMjguNCkiPjxwYXRoIGQ9Im0xMi4wMzEgMTAzMC40Yy0zLjg2NTcgMC02Ljk5OTggMy4xLTYuOTk5OCA3IDAgMS4zIDAuNDAxNyAyLjYgMS4wOTM4IDMuNyAwLjAzMzQgMC4xIDAuMDU5IDAuMSAwLjA5MzggMC4ybDQuMzQzMiA4YzAuMjA0IDAuNiAwLjc4MiAxLjEgMS40MzggMS4xczEuMjAyLTAuNSAxLjQwNi0xLjFsNC44NDQtOC43YzAuNDk5LTEgMC43ODEtMi4xIDAuNzgxLTMuMiAwLTMuOS0zLjEzNC03LTctN3ptLTAuMDMxIDMuOWMxLjkzMyAwIDMuNSAxLjYgMy41IDMuNSAwIDItMS41NjcgMy41LTMuNSAzLjVzLTMuNS0xLjUtMy41LTMuNWMwLTEuOSAxLjU2Ny0zLjUgMy41LTMuNXoiIGZpbGw9IiNjMDM5MmIiLz48cGF0aCBkPSJtMTIuMDMxIDEuMDMxMmMtMy44NjU3IDAtNi45OTk4IDMuMTM0LTYuOTk5OCA3IDAgMS4zODMgMC40MDE3IDIuNjY0OCAxLjA5MzggMy43NDk4IDAuMDMzNCAwLjA1MyAwLjA1OSAwLjEwNSAwLjA5MzggMC4xNTdsNC4zNDMyIDguMDYyYzAuMjA0IDAuNTg2IDAuNzgyIDEuMDMxIDEuNDM4IDEuMDMxczEuMjAyLTAuNDQ1IDEuNDA2LTEuMDMxbDQuODQ0LTguNzVjMC40OTktMC45NjMgMC43ODEtMi4wNiAwLjc4MS0zLjIxODggMC0zLjg2Ni0zLjEzNC03LTctN3ptLTAuMDMxIDMuOTY4OGMxLjkzMyAwIDMuNSAxLjU2NyAzLjUgMy41cy0xLjU2NyAzLjUtMy41IDMuNS0zLjUtMS41NjctMy41LTMuNSAxLjU2Ny0zLjUgMy41LTMuNXoiIGZpbGw9IiNlNzRjM2MiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMTAyOC40KSIvPjwvZz48L3N2Zz4='
    });

    this.infowindow = new google.maps.InfoWindow({
      content: '<p>拖曳我<span class="glyphicon glyphicon-hand-up" aria-hidden="true"></span></p>'
    });
    this.infowindow.open(this.map, this.centerMarker);

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, this.map);

    centerControlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(centerControlDiv);

    this.centerCircle = new google.maps.Circle({
      strokeColor: '#2980B9',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#3498DB',
      fillOpacity: 0.1,
      map: this.map,
      center: latlng,
      radius: 600,
      zIndex: 999
    });

    // google.maps.event.addListener(this.centerMarker, 'dragend', function(event) {
    //   locationAddress(this.centerMarker.getPosition().lat(), this.centerMarker.getPosition().lng());
    // });

    // google.maps.event.addListener(this.map, 'idle', function() {
    //   this.centerMarker.setPosition(this.map.getCenter());
    //   this.centerCircle.setCenter(this.centerMarker.getPosition());
    // });

    google.maps.event.addListener(this.centerMarker, 'dragstart', function(event) {
      this.infowindow.close();
    }.bind(this));

    google.maps.event.addListener(this.centerMarker, 'drag', function(event) {
      this.centerCircle.setCenter(this.centerMarker.getPosition());
    }.bind(this));

    (callback && typeof(callback) === 'function') && callback();
  };

  /**
   * 定位現在位置.
   * @param  {[type]} latitude  [description]
   * @param  {[type]} longitude [description]
   * @return {[type]}           [description]
   */
  var locationAddress = function(latitude, longitude) {
    GMap.map.setCenter(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
    GMap.map.setZoom(14);
    // console.log('定位完成！');
  };

  /**
   * 定位成功.
   * @param  {[type]} pos [description]
   * @return {[type]}     [description]
   */
  var successCallback = function(pos) {
    locationAddress(pos.coords.latitude, pos.coords.longitude);
  };

  /**
   * 定位失敗.
   * @param  {[type]} error [description]
   * @return {[type]}       [description]
   */
  var errorCallback = function(error) {
    switch (error.code) {
      case 1:
        console.error('錯誤!應用程式沒有權限使用定位服務!');
        break;
      case 2:
        console.error('錯誤!取得位址資料時發生錯誤!');
        break;
      case 3:
        console.error('錯誤!超過等待時間...');
        break;
      default:
        console.error('不明錯誤...');
        break;
    }
  };

  /**
   * 客製化按鈕.
   * @param {[type]} controlDiv [description]
   * @param {[type]} map        [description]
   */
  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    this.controlUI = document.createElement('div');
    this.controlUI.style.backgroundColor = '#fff';
    this.controlUI.style.border = '2px solid #fff';
    this.controlUI.style.borderRadius = '3px';
    this.controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    this.controlUI.style.cursor = 'pointer';
    this.controlUI.style.marginLeft = '10px';
    this.controlUI.style.textAlign = 'center';
    this.controlUI.title = '顯示您的位置';

    // Set CSS for the control interior.
    this.controlText = document.createElement('div');
    this.controlText.style.color = 'rgb(25,25,25)';
    this.controlText.style.fontSize = '14px';
    this.controlText.style.lineHeight = '22px';
    this.controlText.style.paddingLeft = '5px';
    this.controlText.style.paddingRight = '5px';
    this.controlText.innerHTML = '<span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>';
    this.controlUI.appendChild(this.controlText);

    controlDiv.appendChild(this.controlUI);

    // Setup the click event listeners.
    this.controlUI.addEventListener('click', function() {
      getCurrentLocation();
    });

  }

  /**
   * 取得現在位置.
   * @return {[type]} [description]
   */
  var getCurrentLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error('錯誤!不支援定位服務!');
    }
  };

  var setMarkerInfoWindow = function(marker, stopName) {
    marker.addListener('click', function() {
      this.infowindow.setOptions({
        content: '<p>' + stopName + '</p>'
      });
      this.infowindow.open(this.map, marker);
    }.bind(GMap));
  };

  GMap.clearMap = function(type) {
    switch (type) {
      case 'Stop':
        if (stopsAry) {
          for (var i = stopsAry.length - 1; i >= 0; i--) {
            stopsAry[i].setMap(null);
          }
          stopsAry.length = 0;
        }
        break;
      case 'GeoJson':
        busLayer.forEach(function(feature) {
          busLayer.remove(feature);
        });

        traLayer.forEach(function(feature) {
          traLayer.remove(feature);
        });

        mrtLayer.forEach(function(feature) {
          mrtLayer.remove(feature);
        });

        ubikeLayer.forEach(function(feature) {
          ubikeLayer.remove(feature);
        });

        break;
    }
  };

  GMap.checkStop = function(type, state) {
    if (stopsAry) {
      for (var i = stopsAry.length - 1; i >= 0; i--) {
        if (stopsAry[i].type === type) {
          stopsAry[i].setMap(state ? this.map : null);
        }
      }
    }
  }.bind(GMap);

  GMap.addStops = function(data) {
    this.clearMap('Stop');
    if (data.result.length > 0) {
      for (var i = data.result.length - 1; i >= 0; i--) {
        var _fillColor = '';
        var _title = '';
        var _type = data.result[i].type;
        switch (_type) {
          case 'M':
            _fillColor = '#2980b9';
            _title = '捷運站: ';
            break;
          case 'B':
            _fillColor = '#16a085';
            _title = '客運站: ';
            break;
          case 'T':
            _fillColor = '#c0392b';
            _title = '火車站: ';
            break;
          case 'Y':
            _fillColor = '#f39c12';
            _title = 'YouBike: ';
            break;
        }

        var _marker = new google.maps.Marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: _fillColor,
            fillOpacity: 1,
            scale: 4.5,
            strokeColor: 'white',
            strokeWeight: 0.5
          },
          map: this.level[_type] ? this.map : null,
          type: _type,
          position: {
            lat: parseFloat(data.result[i].lat),
            lng: parseFloat(data.result[i].lng),
          }
        });

        stopsAry.push(_marker);
        setMarkerInfoWindow(_marker, _title + data.result[i].name);
      }
    }
  }.bind(GMap);

  GMap.addGeoJson = function(data) {
    this.clearMap('GeoJson');
    if (!jQuery.isEmptyObject(data)) {
      mrtLayer.setStyle({
        fillColor: '#2980b9',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 991
      });

      busLayer.setStyle({
        fillColor: '#16a085',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 995
      });

      traLayer.setStyle({
        fillColor: '#c0392b',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 997
      });

      ubikeLayer.setStyle({
        fillColor: '#f39c12',
        fillOpacity: 0.6,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 1.2,
        zIndex: 996
      });

      if (data.result.B) {
        busLayer.addGeoJson(jQuery.parseJSON(data.result.B));
      }
      if (data.result.M) {
        mrtLayer.addGeoJson(jQuery.parseJSON(data.result.M));
      }
      if (data.result.T) {
        traLayer.addGeoJson(jQuery.parseJSON(data.result.T));
      }
      if (data.result.Y) {
        ubikeLayer.addGeoJson(jQuery.parseJSON(data.result.Y));
      }

      busLayer.setMap(this.map);
      mrtLayer.setMap(this.map);
      traLayer.setMap(this.map);
      ubikeLayer.setMap(this.map);
    }
  }.bind(GMap);

  // transport
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(GMap);
  } else {
    // browser global
    window.GMap = GMap;
  }

})();