package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.repository.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public List<Session> getSessionsDisponibles() {
        return sessionRepository.findByDateDebutAfter(LocalDateTime.now());
    }

    public List<Session> getSessionsByFormation(Formation formation) {
        return sessionRepository.findByFormation(formation);
    }

    public void creerSession(Session session) {
        sessionRepository.save(session);
    }

    public Session getSessionById(Long id) {
        return sessionRepository.findById(id).orElse(null);
    }

    public int getCapaciteRestante(Long idSession) {
        Session session = sessionRepository.findById(idSession).orElse(null);
        if (session != null) {
            return session.getCapaciteRestante();
        }
        return 0;
    }
}
