function weather()
{
    $.ajax(
    {
        type: "GET",
        url: baseUrl + "todos/weather",
        headers : {usertoken : localStorage.accessToken}
    })
    .done(data =>
    {
        $("#airvisual-city").text(`City: ${data.city}`);
        $("#airvisual").text(`Weather: ${data.current.weather.tp} degrees, Humidity: ${data.current.weather.hu}%, Pressure: ${data.current.weather.pr} hPa, Wind: ${data.current.weather.ws} m/s`);
    })
    .fail(err => console.log(err));
}