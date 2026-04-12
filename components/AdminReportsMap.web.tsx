import { useEffect, useMemo, useState } from 'react';

type ReportMapItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt?: any;
};

type Props = {
  reports?: ReportMapItem[];
  selectedReport?: ReportMapItem | null;
  onSelectReport?: (report: ReportMapItem) => void;
};

export default function AdminReportsMap({
  reports = [],
  selectedReport = null,
  onSelectReport,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [leafletLib, setLeafletLib] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    const loadMap = async () => {
      const leaflet = await import('react-leaflet');
      const L = await import('leaflet');

      setMapComponents({
        MapContainer: leaflet.MapContainer,
        TileLayer: leaflet.TileLayer,
        Marker: leaflet.Marker,
        Popup: leaflet.Popup,
      });

      setLeafletLib(L);
    };

    loadMap();
  }, []);

  const center = useMemo<[number, number]>(() => {
    if (selectedReport) {
      return [selectedReport.latitude, selectedReport.longitude];
    }

    if (reports.length > 0) {
      return [reports[0].latitude, reports[0].longitude];
    }

    return [14.5995, 120.9842];
  }, [reports, selectedReport]);

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();

    if (['resolved', 'completed', 'done'].includes(normalized)) return '#22C55E';
    if (['in progress', 'ongoing', 'processing'].includes(normalized)) return '#FF6B00';
    if (['pending', 'new'].includes(normalized)) return '#3B82F6';

    return '#9CA3AF';
  };

  const createPinIcon = (color: string, isSelected: boolean = false) => {
    if (!leafletLib) return null;

    const size = isSelected ? 34 : 28;

    return leafletLib.divIcon({
      className: '',
      html: `
        <div style="
          width:${size}px;
          height:${size}px;
          background:${color};
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 3px 10px rgba(0,0,0,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <div style="
            width:${isSelected ? 12 : 10}px;
            height:${isSelected ? 12 : 10}px;
            background:white;
            border-radius:50%;
            transform:rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  };

  if (!mounted || !MapComponents || !leafletLib) {
    return (
      <div
        style={{
          height: '560px',
          width: '100%',
          borderRadius: '16px',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          color: '#555',
          border: '1px solid #ddd',
        }}
      >
        Loading map...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div style={{ height: '560px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          const isSelected = selectedReport?.id === report.id;
          const pinColor = getStatusColor(report.status);

          return (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={createPinIcon(pinColor, isSelected)}
              eventHandlers={{
                click: () => {
                  onSelectReport?.(report);
                },
              }}
            >
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <strong>{report.title}</strong>
                  <br />
                  Category: {report.category}
                  <br />
                  Status: {report.status}
                  <br />
                  Address: {report.address}
                  <br />
                  <button
                    style={{
                      marginTop: '8px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: pinColor,
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    onClick={() => onSelectReport?.(report)}
                  >
                    Select report
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}