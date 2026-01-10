import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, CreditCard, Lock } from 'lucide-react';
import stripePromise from '../stripe.js';

// composant du formulaire de paiement
function CheckoutForm({ totalPrice, inscriptions, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      // création d'un payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // paiement réussi !
      console.log('Payment Method créé:', paymentMethod.id);

      // simulation d'attente
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Paiement effectué avec succès !');
      onSuccess(paymentMethod);

    } catch (err) {
      console.error('Erreur paiement:', err);
      setError('Une erreur est survenue lors du paiement.');
    } finally {
      setLoading(false);
    }
  };

  // rendu du formulaire
  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          Récapitulatif de la commande
        </h3>

        <div style={{ background: '#f8f8f8', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
          {inscriptions.map((insc, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: idx < inscriptions.length - 1 ? '1px solid #ddd' : 'none'
            }}>
              <span style={{ fontWeight: '500' }}>{insc.formation?.intitule}</span>
              <span style={{ fontWeight: 'bold' }}>{insc.formation?.prix} €</span>
            </div>
          ))}

          <div style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '2px solid rgba(130, 3, 192, 1)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: 'rgba(130, 3, 192, 1)'
          }}>
            <span>Total</span>
            <span>{totalPrice} €</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px',
          fontWeight: '600',
          color: '#333'
        }}>
          <CreditCard size={20} />
          Informations de carte bancaire
        </label>

        <div style={{
          padding: '15px',
          border: '2px solid #e0e0e0',
          borderRadius: '10px',
          background: '#fff'
        }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#333',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c00',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        background: '#f0f9ff',
        borderRadius: '8px',
        marginBottom: '25px',
        fontSize: '0.85rem',
        color: '#0369a1'
      }}>
        <Lock size={16} />
        Paiement 100% sécurisé par Stripe
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            flex: 1,
            padding: '14px',
            background: loading ? '#ccc' : 'rgba(130, 3, 192, 1)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(130, 3, 192, 0.3)'
          }}
        >
          {loading ? 'Traitement...' : `Payer ${totalPrice} €`}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            padding: '14px 30px',
            background: '#fff',
            color: '#666',
            border: '2px solid #ddd',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Annuler
        </button>
      </div>
      {/* test sans le backend*/}
      <p style={{
        marginTop: '20px',
        fontSize: '0.8rem',
        color: '#999',
        textAlign: 'center'
      }}>
        Mode test : Utilisez 4242 4242 4242 4242 avec n'importe quelle date et cvc.
      </p>
    </form>
  );
}

// Composant principal avec la modale
export default function StripeCheckout({ totalPrice, inscriptions, onSuccess, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: '#333' }}>
          Paiement sécurisé
        </h2>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            totalPrice={totalPrice}
            inscriptions={inscriptions}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}