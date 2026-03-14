import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Phone, Plus, Search, User } from 'lucide-react';

export function Patients() {
  const navigate = useNavigate();
  const { patients } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
  );

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
        {/* Search and Add */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.fullName}</p>
                        <a
                          href={`tel:${patient.phone}`}
                          className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate('/appointments/new', { state: { patientId: patient.id } })
                      }
                    >
                      Agendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
