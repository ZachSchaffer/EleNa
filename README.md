# EleNa
Navigation system to determine a route which minimizes or maximizes elevation gain, while limiting the total distance between the two locations to x% of the shortest path.

[Github repo](https://github.com/ZachSchaffer/EleNa)

![EleNa example](https://cdn.discordapp.com/attachments/747874326073704518/780993106786254848/unknown.png)

## Check out the hosted application
[EleNa](https://gonefishering-elena.web.app/home)

## Check out a video demonstration of EleNa
[EleNa Video Demonstration](https://www.youtube.com/watch?v=HPW9YIntYK8&feature=youtu.be)

## How to run locally
In the project directory, you need to run:

### Install Node.js
Nodejs is required to run the application

### Install yarn
Yarn is used to install the dependencies and run the application

### `yarn install`
This will install the necessary dependencies to run EleNa

### `yarn start`
This will start EleNa in your default browser assuming you ran `yarn install`
- *Note: Avoid using Firefox*

### `yarn test`
Run the automated testing framework

## Route elevation color scale
- blue: heavy decline
- green: moderate decline
- yellow: roughly flat
- orange: moderate uphill
- red: heavy uphill

## Adjust the % away from the shortest path
Here you can see the difference between inputted 5% away from the shortest path vs 40% away from the shortest path while minimizing elevation when traveling from 160 Infirmary Way, Amherst, MA to Orchard Hill Drive, Amherst, MA

5% away from the shortest path
![5% away](https://cdn.discordapp.com/attachments/747874326073704518/780997565625139250/unknown.png)

40% away from the shortest path
![40% away](https://cdn.discordapp.com/attachments/747874326073704518/780997919288721408/unknown.png)

## Turn by turn view

There is a turn by turn card in the bottom right corner of the map which allows you to receive directions as you travel
![Turn by turn view start](https://cdn.discordapp.com/attachments/747874326073704518/780994216721383434/unknown.png)

You can click next direction to navigate through the path
![Intermediate location turn by turn](https://cdn.discordapp.com/attachments/747874326073704518/780994790229540884/unknown.png)

You can also toggle the 'Turn by Turn' view instead of the map view with the toggle on the left side
![Turn by turn toggled](https://cdn.discordapp.com/attachments/747874326073704518/780995200846790706/unknown.png)

## Minimize and Maximize Elevation
You can minimize or maximize your elevation gain when calculating your optimal path

Minimize elevation gain from 160 Infirmary Way, Amherst, MA to Orchard Hill Drive, Amherst, MA
![minimize](https://cdn.discordapp.com/attachments/747874326073704518/780997565625139250/unknown.png)
Maximize elevation gain from 160 Infirmary Way, Amherst, MA to Orchard Hill Drive, Amherst, MA
![maximize](https://cdn.discordapp.com/attachments/747874326073704518/780998991868854292/unknown.png)

## Architecture
![EleNa Architecture](https://cdn.discordapp.com/attachments/747874326073704518/780993141900836874/Screen_Shot_2020-11-24_at_10.07.34_PM.png)

## Technologies
- Front end: React (class based components)
- APIs:
    - Mapbox: Displaying the map
    - MapQuest: Retrieving the latitude and longitude for the front end
    - Maptiller: Themeing for the map
    - Air Map: Used to retrieve the elevation data given a list of latitude and longitude points
- Backend: JavaScript


