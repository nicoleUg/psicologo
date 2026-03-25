import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Calendar, Phone, Plus, Search, User, X } from 'lucide-react';

export function Patients() {
  const navigate = useNavigate();
  const { patients, appointments } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'name' | 'phone'>('all');

  const getPatientAppointmentCount = (patientId: string): number => {
    return appointments.filter((apt) => apt.patientId === patientId).length;
  };

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();

    switch (filterType) {
      case 'name':
        return patient.fullName.toLowerCase().includes(query);
      case 'phone':
        return patient.phone.includes(query);
      case 'all':
      default:
        return (
          patient.fullName.toLowerCase().includes(query) ||
          patient.phone.includes(query)
        );
    }
  }).sort((a, b) => a.fullName.localeCompare(b.fullName));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/calendar')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al calendario
          </Button>
          <h1 className="font-semibold text-xl">Directorio de Pacientes</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de búsqueda</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'name', 'phone'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as 'all' | 'name' | 'phone')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type === 'all' ? 'Todo' : type === 'name' ? 'Nombre' : 'Teléfono'}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={
                filterType === 'all'
                  ? 'Buscar por nombre o teléfono...'
                  : filterType === 'name'
                    ? 'Buscar por nombre...'
                    : 'Buscar por teléfono...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={() => navigate('/patients/new')} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Nuevo Paciente
          </Button>
        </div>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery ? 'No se encontraron resultados' : 'No hay pacientes registrados'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''}{' '}
              {searchQuery && 'encontrado(s)'}
            </p>
            {filteredPatients.map((patient) => {
              const appointmentCount = getPatientAppointmentCount(patient.id);
              return (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{patient.fullName}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                            <a
                              href={`tel:${patient.phone}`}
                              className="hover:text-indigo-600 flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{patient.phone}</span>
                            </a>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              {appointmentCount} cita{appointmentCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate('/appointments/new', { state: { patientId: patient.id } })
                        }
                        className="flex-shrink-0"
                      >
                        Agendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
