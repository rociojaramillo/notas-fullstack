package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Nota;
import com.example.demo.repository.NotaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/notas")
@CrossOrigin(origins = "http://localhost:5173") // para que se conecte nuestro frontend en react (permisos para comunicarse con el controlador)
public class NotaController {

    @Autowired NotaRepository notaRepository;

    //obtener todas las notas

    @GetMapping
    public List<Nota> getAllNotas(){
        return notaRepository.findAll();
    }
    
    //crear una nota
    @PostMapping 
    public Nota createNota(@RequestBody Nota nota) { // con request body, recibo una peticion post, valido que sea del tipo Nota y lo guardo en la variable nota
        return notaRepository.save(nota);
    }

    //editar la nota
    @PutMapping("/{id}")
    public Nota updateNota(@PathVariable Long id, @RequestBody Nota notaDetalles) {//notaDetalles es la nueva nota que recibo directamente desde el frontend
        Optional<Nota> optionalNota = notaRepository.findById(id); //verifico si existe

        if (optionalNota.isPresent()) {
            Nota nota = optionalNota.get(); //si nuestro tipo Nota existe, lo guardo en "nota"
            nota.setTitulo(notaDetalles.getTitulo());
            nota.setDescripcion(notaDetalles.getDescripcion());

            return notaRepository.save(nota);
        } else {
            return null; // si no existe, no retorno nada
        }
    }
    
    @DeleteMapping("/{id}")
    public String deleteNota(@PathVariable Long id) {
        Optional<Nota> optionalNota = notaRepository.findById(id); //verifico si existe

        if (optionalNota.isPresent()) {
            notaRepository.delete(optionalNota.get());
            return "Nota eliminada correctamente";
        } else {
            return null;
        }
    }
}
