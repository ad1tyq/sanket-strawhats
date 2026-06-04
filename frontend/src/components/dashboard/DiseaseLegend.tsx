// DisasterLegend.tsx
const disasterColors = {
  cyclone: "#FF0000", // Red
  flood: "#0000FF",   // Blue
  tsunami: "#00FF00", // Green
};

export default function DisasterLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-md">
      <h3 className="font-semibold mb-2">Disaster Types</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: disasterColors.cyclone }}></div>
          <span>Cyclone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: disasterColors.flood }}></div>
          <span>Flood</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: disasterColors.tsunami }}></div>
          <span>Tsunami</span>
        </div>
      </div>
    </div>
  );
}