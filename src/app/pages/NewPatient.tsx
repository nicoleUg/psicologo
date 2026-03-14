import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export function NewPatient() {
  const navigate = useNavigate();
  const { addPatient } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient = await addPatient({
      fullName: fullName.trim(),
      phone: phone.trim(),
    });

    if (!newPatient) {
      toast.error(
        'No se pudo registrar el paciente en Supabase. Verifique tablas/policies (public.patients) en SUPABASE-SETUP.md.'
      );
      return;
    }

    toast.success(`Paciente ${newPatient.fullName} registrado correctamente`);
    navigate('/patients');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/patients')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al directorio
          </Button>
          <h1 className="font-semibold text-xl">Registrar Paciente</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Paciente</CardTitle>
            <CardDescription>
              Ingrese los datos básicos del paciente para registrarlo en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ej: María García López"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                    minLength={3}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono de Contacto *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ej: +34 612 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Incluya el código de país para facilitar las llamadas
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/patients')}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:flex-1">
                  Registrar Paciente
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
