'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from './leads.module.scss';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes?: string;
  createdAt: string;
}

interface Counts {
  new: number;
  contacted: number;
  converted: number;
  closed: number;
  total: number;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Counts>({
    new: 0,
    contacted: 0,
    converted: 0,
    closed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      const url = filter ? `/api/leads?status=${filter}` : '/api/leads';
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok) {
        setLeads(data.data.leads);
        setCounts(data.data.counts);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.ok) {
        await fetchLeads();
        if (selectedLead?._id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus as any });
        }
      } else {
        alert(data.error || 'שגיאה בעדכון סטטוס');
      }
    } catch (err) {
      alert('שגיאת רשת');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את הפניה של ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.ok) {
        await fetchLeads();
        if (selectedLead?._id === id) {
          setShowDetails(false);
          setSelectedLead(null);
        }
      } else {
        alert(data.error || 'שגיאה במחיקה');
      }
    } catch (err) {
      alert('שגיאת רשת');
    }
  };

  const openDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedLead(null);
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      new: { text: 'חדש', className: styles.new },
      contacted: { text: 'נוצר קשר', className: styles.contacted },
      converted: { text: 'הומר', className: styles.converted },
      closed: { text: 'סגור', className: styles.closed },
    };
    const badge = badges[status] || { text: status, className: '' };
    return <span className={`${styles.badge} ${badge.className}`}>{badge.text}</span>;
  };

  if (loading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📥 ניהול לידים</h1>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{counts.new}</span>
            <span className={styles.statLabel}>חדשים</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{counts.contacted}</span>
            <span className={styles.statLabel}>נוצר קשר</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{counts.converted}</span>
            <span className={styles.statLabel}>הומרו</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{counts.total}</span>
            <span className={styles.statLabel}>סה"כ</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <Button
          size="sm"
          variant={filter === '' ? 'primary' : 'secondary'}
          onClick={() => setFilter('')}
        >
          הכל ({counts.total})
        </Button>
        <Button
          size="sm"
          variant={filter === 'new' ? 'primary' : 'secondary'}
          onClick={() => setFilter('new')}
        >
          חדשים ({counts.new})
        </Button>
        <Button
          size="sm"
          variant={filter === 'contacted' ? 'primary' : 'secondary'}
          onClick={() => setFilter('contacted')}
        >
          נוצר קשר ({counts.contacted})
        </Button>
        <Button
          size="sm"
          variant={filter === 'converted' ? 'primary' : 'secondary'}
          onClick={() => setFilter('converted')}
        >
          הומרו ({counts.converted})
        </Button>
        <Button
          size="sm"
          variant={filter === 'closed' ? 'primary' : 'secondary'}
          onClick={() => setFilter('closed')}
        >
          סגורים ({counts.closed})
        </Button>
      </div>

      <div className={styles.tableCard}>
        {leads.length === 0 ? (
          <div className={styles.empty}>
            <p>אין לידים להצגה</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>שם</th>
                <th>נושא</th>
                <th>סטטוס</th>
                <th>תאריך</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div className={styles.leadInfo}>
                      <strong>{lead.name}</strong>
                      <div className={styles.contact}>
                        <span>📧 {lead.email}</span>
                        <span>📞 {lead.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.topic}>{lead.topic}</span>
                  </td>
                  <td>{getStatusBadge(lead.status)}</td>
                  <td>
                    {new Date(lead.createdAt).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className={styles.actions}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openDetails(lead)}
                    >
                      👁️ צפה
                    </Button>
                    {lead.status === 'new' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStatusChange(lead._id, 'contacted')}
                      >
                        ✅ סמן כנוצר קשר
                      </Button>
                    )}
                    {lead.status === 'contacted' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStatusChange(lead._id, 'converted')}
                      >
                        💰 סמן כהומר
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(lead._id, lead.name)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Lead Details Modal */}
      {showDetails && selectedLead && (
        <div className={styles.modal} onClick={closeDetails}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>פרטי פנייה</h2>
              <button className={styles.closeBtn} onClick={closeDetails}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3>מידע אישי</h3>
                <div className={styles.detailRow}>
                  <strong>שם:</strong>
                  <span>{selectedLead.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <strong>אימייל:</strong>
                  <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a>
                </div>
                <div className={styles.detailRow}>
                  <strong>טלפון:</strong>
                  <a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>פרטי הפנייה</h3>
                <div className={styles.detailRow}>
                  <strong>נושא:</strong>
                  <span>{selectedLead.topic}</span>
                </div>
                <div className={styles.detailRow}>
                  <strong>סטטוס:</strong>
                  {getStatusBadge(selectedLead.status)}
                </div>
                <div className={styles.detailRow}>
                  <strong>תאריך:</strong>
                  <span>
                    {new Date(selectedLead.createdAt).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>ההודעה</h3>
                <div className={styles.message}>{selectedLead.message}</div>
              </div>

              <div className={styles.modalActions}>
                {selectedLead.status === 'new' && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedLead._id, 'contacted');
                    }}
                  >
                    ✅ סמן כנוצר קשר
                  </Button>
                )}
                {selectedLead.status === 'contacted' && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedLead._id, 'converted');
                    }}
                  >
                    💰 סמן כהומר
                  </Button>
                )}
                {selectedLead.status === 'converted' && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleStatusChange(selectedLead._id, 'closed');
                    }}
                  >
                    סגור
                  </Button>
                )}
                <Button variant="secondary" onClick={closeDetails}>
                  סגור
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

