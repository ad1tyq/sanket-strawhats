# Sanket - IIC 2.0 Submission by The StrawHats

Sanket is a proactive, accessible, and intelligent early warning system designed to close the critical information gap between rural communities and public health officials, reducing outbreak response time for water-borne diseases from one week to under 24 hours.

Our team, The StrawHats, secured the 4th position nationally and 2nd position at our university in the International Innovation Challenge (IIC) 2.0.

## 💡 The Problem: The 7-Day Lag

In remote villages, it can take up to a week for a local health worker (ASHA) to manually report a disease outbreak to district officials. By then, a full-blown epidemic is underway.

## 🚀 Our Solution: The 24-Hour Response

Sanket empowers ASHA workers to log symptoms instantly via their phones. Our system analyzes the data in real-time, detects potential outbreaks, and sends automated alerts to health officials, enabling a response before a crisis escalates.

## ✨ Key Features

Offline-First PWA: An installable web app for ASHA workers that works perfectly even with no internet connection. Reports are saved locally and synced automatically.

IVR (Voice Call) Reporting: A revolutionary feature that allows any ASHA with any basic phone to call a number and submit a report using their keypad, ensuring 100% accessibility.

Real-time GIS Dashboard: A map-based dashboard for health officials to visualize hotspots, track data, and coordinate a rapid response.

Automated SMS Alerts: Instant SMS notifications sent via Twilio to officials when a high-risk situation is detected.

## 🛠️ Tech Stack

Component                    Technology

Frontend & PWA               Next.js (React), Tailwind CSS

Backend API                  Next.js API Routes

Database                     Vercel Postgres + Prisma ORM

Comms (IVR/SMS)              Twilio

Mapping                      Google Maps API (@react-google-maps/api)

Backend                      Python (FastAPI)




