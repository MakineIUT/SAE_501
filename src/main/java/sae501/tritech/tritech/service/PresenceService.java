package sae501.tritech.tritech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sae501.tritech.tritech.entity.*;
import sae501.tritech.tritech.repository.PresenceRepository;
import java.util.List;

@Service
@Transactional
public class PresenceService {

    @Autowired
    private PresenceRepository presenceRepository;

    public double getTauxPresence(Apprenant apprenant) {
        List<Presence> presences = presenceRepository.findByApprenant(apprenant);

        if (presences == null || presences.isEmpty()) {
            return 0.0;
        }

        long nombrePresent = presences.stream()
                .filter(Presence::isPresent)
                .count();

        return (double) nombrePresent / presences.size() * 100;
    }

    public double getTauxPresenceSession(Apprenant apprenant, Session session) {
        List<Presence> presences = presenceRepository.findByApprenant(apprenant);

        long totalSession = presences.stream()
                .filter(p -> p.getSession().equals(session))
                .count();

        if (totalSession == 0) {
            return 0.0;
        }

        long presentSession = presences.stream()
                .filter(p -> p.getSession().equals(session) && p.isPresent())
                .count();

        return (double) presentSession / totalSession * 100;
    }

    public List<Presence> getPresencesByApprenant(Apprenant apprenant) {
        return presenceRepository.findByApprenant(apprenant);
    }

    public List<Presence> getPresencesBySession(Session session) {
        return presenceRepository.findBySession(session);
    }
}