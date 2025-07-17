class ApiService {
  static baseURL = 'http://localhost:3000/api/registro';

  static getHeaders(user) {
    return {
      Authorization: `${user.tipo.toUpperCase()}:${user.id}`
    };
  }

  static async fetchAPI(endpoint, options = {}) {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Studente APIs
  static async getInfoStudente(user) {
    return this.fetchAPI(`${this.baseURL}/studente/info`, {
      headers: this.getHeaders(user)
    });
  }


  static async getVotiStudente(user) {
    return this.fetchAPI(`${this.baseURL}/studente/voti`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMediaPerMateria(user) {
    return this.fetchAPI(`${this.baseURL}/studente/media-per-materia`, {
      headers: this.getHeaders(user)
    });
  }

  static async getDistribuzioneVoti(user) {
    return this.fetchAPI(`${this.baseURL}/studente/distribuzione-voti`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMediaGenerale(user) {
    return this.fetchAPI(`${this.baseURL}/studente/media-generale`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiFiltratiPerData(user, startDate, endDate) {
    return this.fetchAPI(`${this.baseURL}/studente/voti-filtrati?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiPerMateria(user, materia) {
    return this.fetchAPI(`${this.baseURL}/studente/voti-materia/${materia}`, {
      headers: this.getHeaders(user)
    });
  }

  // Docente APIs
  static async getInfoDocente(user) {
    return this.fetchAPI(`${this.baseURL}/docente/info`, {
      headers: this.getHeaders(user)
    });
  }

  static async getClassiDocente(user) {
    return this.fetchAPI(`${this.baseURL}/docente/classi`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMaterieDocente(user) {
    return this.fetchAPI(`${this.baseURL}/docente/materie`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiStudenteDocente(user, idStudente) {
    return this.fetchAPI(`${this.baseURL}/docente/studente/${idStudente}/voti`, {
      headers: this.getHeaders(user)
    });
  }

  static async getMediaStudente(user, idStudente) {
    return this.fetchAPI(`${this.baseURL}/docente/studente/${idStudente}/media`, {
      headers: this.getHeaders(user)
    });
  }

  static async inserisciVoto(user, data) {
    return this.fetchAPI(`${this.baseURL}/docente/voto`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  static async modificaVoto(user, data) {
    return this.fetchAPI(`${this.baseURL}/docente/voto`, {
      method: 'PUT',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  static async eliminaVoto(user, idVoto) {
    return this.fetchAPI(`${this.baseURL}/docente/voto`, {
      method: 'DELETE',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_voto: idVoto })
    });
  }

  static async inserisciVotiClasse(user, data) {
    return this.fetchAPI(`${this.baseURL}/docente/classe/voti`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(user),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  static async getMediaClasse(user, idClasse, materia) {
    return this.fetchAPI(`${this.baseURL}/docente/classe/${idClasse}/materia/${materia}/media`, {
      headers: this.getHeaders(user)
    });
  }

  static async getVotiDocenteFiltrati(user, idStudente, startDate, endDate) {
    return this.fetchAPI(`${this.baseURL}/docente/studente/${idStudente}/voti-filtro?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.getHeaders(user)
    });
  }
}

export default ApiService;