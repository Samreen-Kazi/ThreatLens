import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";

import type { IPInfo } from "../types/analysis";

interface IPLocationMapProps {
  ipInfo: IPInfo;
}

function IPLocationMap({
  ipInfo,
}: IPLocationMapProps) {
  const hasCoordinates =
    ipInfo.latitude !== null &&
    ipInfo.longitude !== null;

  if (!hasCoordinates) {
    return (
      <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Geographic context
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          IP location
        </h2>

        <div className="mt-6 flex min-h-72 items-center justify-center rounded-2xl border border-white/5 bg-slate-950/50">
          <p className="px-6 text-center text-sm text-slate-500">
            Geographic coordinates were not available for this IP address.
          </p>
        </div>
      </article>
    );
  }

  const position: [number, number] = [
    ipInfo.latitude,
    ipInfo.longitude,
  ];

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Geographic context
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          IP location
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Approximate location returned by the configured IP intelligence
          provider.
        </p>
      </div>

      <div className="h-96 border-t border-white/10">
        <MapContainer
          center={position}
          zoom={6}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CircleMarker
            center={position}
            radius={10}
            pathOptions={{
              color: "#22d3ee",
              fillColor: "#06b6d4",
              fillOpacity: 0.75,
              weight: 3,
            }}
          >
            <Popup>
              <div>
                <strong>{ipInfo.ip}</strong>

                <br />

                {ipInfo.city ?? "Unknown city"}
                {ipInfo.region
                  ? `, ${ipInfo.region}`
                  : ""}

                <br />

                {ipInfo.country ??
                  "Unknown country"}

                <br />

                {ipInfo.organization ??
                  "Unknown organization"}
              </div>
            </Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </article>
  );
}

export default IPLocationMap;