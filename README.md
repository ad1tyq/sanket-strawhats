# Sanket - IIC 2.0 Submission by The StrawHats

Sanket is a proactive, accessible, and intelligent early warning system designed to close the critical information gap between rural communities and public health officials, reducing outbreak response time for water-borne diseases from one week to under 24 hours.

Our team, The StrawHats, secured the 4th position nationally and 2nd position at our university in the International Innovation Challenge (IIC) 2.0.

## 💡 The Problem: The 7-Day Lag

In remote villages, it can take up to a week for a local health worker (ASHA) to manually report a disease outbreak to district officials. By then, a full-blown epidemic is underway.

## 🚀 Our Solution: The 24-Hour Response

Sanket empowers ASHA workers to log symptoms instantly via their phones. Our system analyzes the data in real-time, detects potential outbreaks, and sends automated alerts to health officials, enabling a response before a crisis escalates.

## 🏗️ System Architecture

### Our system is composed of four key pillars, creating a seamless flow from data collection to life-saving action:

Data Input: ASHAs on the ground report data via a Progressive Web App (PWA) or an Interactive Voice Response (IVR) phone call.

Backend & Database: A Next.js API receives the data, which is stored in a Vercel Postgres database using the Prisma ORM.

Analysis Engine: A simple but powerful rule-based engine (built into the Next.js API) analyzes incoming data in real-time to assess risk.

Dashboard & Alerting: A web dashboard for health officials visualizes the risk on a map, and automated SMS alerts are sent via Twilio when a threat is detected.

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

## 👥 Team - The StrawHats

Aditya Bhardwaj

Rohan Eipe

Aayush Nikam

Aryan Pillai


