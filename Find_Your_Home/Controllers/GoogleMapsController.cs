using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleMapsController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public GoogleMapsController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("distances")]
        public async Task<IActionResult> GetDistances([FromQuery] double lat, [FromQuery] double lng)
        {
            string apiKey = "AIzaSyBG-_7FJZ_xOMG3zfjE50XbHFz_7SCfh8Y"; 
            string radius = "4000"; 

            var distances = new
            {
                supermarket = await GetNearestPlaceDistance(lat, lng, "supermarket", apiKey, radius),
                school = await GetNearestPlaceDistance(lat, lng, "school|secondary_school", apiKey, radius),
                bus_station = await GetNearestPlaceDistance(lat, lng, "bus_station", apiKey, radius),
                subway_station = await GetNearestPlaceDistance(lat, lng, "subway_station", apiKey, radius)
            };

            return Ok(distances);
        }

        private async Task<object?> GetNearestPlaceDistance(double lat, double lng, string placeType, string apiKey, string radius)
        {
            string location = $"{lat},{lng}";
            try
            {
                var placesUrl = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type={placeType}&key={apiKey}";
                var placesResponse = await _httpClient.GetStringAsync(placesUrl);
                dynamic places = JsonConvert.DeserializeObject(placesResponse);

                if (places.results.Count == 0)
                    return null; 

                var nearest = places.results[0];
                string dest = $"{nearest.geometry.location.lat},{nearest.geometry.location.lng}";

                var distanceUrl = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={location}&destinations={dest}&key={apiKey}";
                var distanceResponse = await _httpClient.GetStringAsync(distanceUrl);
                dynamic distanceData = JsonConvert.DeserializeObject(distanceResponse);
                var element = distanceData.rows[0].elements[0];

                return new
                {
                    name = nearest.name.ToString(),
                    distance = element.distance.text.ToString(),
                    duration = element.duration.text.ToString()
                };
            }
            catch
            {
                return null;
            }
        }
    }
}
