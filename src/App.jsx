import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [ville, setVille] = React.useState("");
  const [temperature, setTemperature] = React.useState("");
  const [condition, setCondition] = React.useState("");
  const [erreur, setErreur] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [villeEcrite, setVilleEcrite] = React.useState('');

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          fetch(`https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/geo?lon=${longitude}&lat=${latitude}`)
            .then((response) => response.json())
            .then((data) => {
              const city = data.city.charAt(0).toUpperCase() + data.city.slice(1);
              setVille(city);
            })
            .catch((error) => {
              console.error('Erreur :', error);
              setErreur(error);
            });
        }
      );
    } else {
      console.log("La géolocalisation n'est pas disponible dans ce navigateur.");
    }
  }, []);

  React.useEffect(() => {
    if(ville!=""){
      setLoading(true);
    fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/weather/"+ville)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setTemperature(data.temperature+"°");
        setCondition(data.condition);
      })
      .catch((error) => {
        setLoading(false);
        setErreur(error);
        console.error("Erreur :", error);
      });
    }else{
      setVille("");
      setTemperature("");
      setCondition("");
    }
  }, [ville]);

  const conseil = () => {
    let conseilText="";
    switch (condition) {
      case "sunny":
        conseilText = "Portez des lunettes de soleil et allez prendre l'air !";
        break;
      case "cloudy":
        conseilText = "Prenez un parapluie.";
        break;
      case "windy":
        conseilText = "Attention au vent.";
        break;
      case "rainy":
        conseilText = "Prenez un imperméable ou un parapluie.";
        break;
      case "stormy":
        conseilText = "Restez à l'intérieur.";
        break;
      default:
        conseilText = "Préparez-vous pour la journée.";
    }
    return conseilText;
  }

  const traduireCondition = () => {
    switch (condition) {
      case "sunny":
        return "Ensoleillé";
      case "cloudy":
        return "Nuageux";
      case "windy":
        return "Vent";
      case "rainy":
        return "Pluvieux";
      case "stormy":
        return "Orageux";
    }
  };

  const traduireImage = () => {
    switch (condition) {
      case "sunny":
        return "sunny";
      case "cloudy":
        return "cloud";
      case "windy":
        return "air";
      case "rainy":
        return "rainy";
      case "stormy":
        return "thunderstorm";
    }
  };

  const handleInputChange = (event) => {
    setVilleEcrite(event.target.value);
  };
  
  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      setVille(villeEcrite);
      setVilleEcrite("");
    }
  };

  
  return (
    <>
      <div className="box">
        <div>
          <p style={{ backgroundColor: 'white' , display: 'inline-block', borderRadius: '10px', padding:'8px'}}>
        <span className="material-symbols-outlined"style={{ verticalAlign: 'middle' }}>search</span>
          <input type="text" value={villeEcrite} onChange={handleInputChange} onKeyPress={handleInputKeyPress} placeholder="Rechercher" />
          </p>
        </div>
        {loading && <p style={{ fontSize: '1.5em' }}>Chargement en cours...</p>}
        {erreur && <p style={{ fontSize: '1.5em' }}>Erreur: {erreur.message}</p>}
        <table>
          <tbody>
          <tr className={ville ? "border-top-and-bottom city-font" : ""}>
              <td>
              {ville && <p><span style={{ fontWeight: 'bold'}}>{ville}</span> . FRANCE</p>}
              </td>
              <td></td>
            </tr>
            <tr className={ville ? "border-top-and-bottom" : ""}>
              <td ><span style={{ fontWeight: 'bold', fontSize: '3em' }}>{temperature}</span><br/>{traduireCondition()}</td>
              <td>
              <span className="material-symbols-outlined" style={{ fontSize: '5em' }}>{traduireImage()}</span>
              </td>
            </tr>
            <tr>
              <td>Conseil météo : {conseil()}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App
